# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///

"""
ElevenLabs Production Voice Synthesis & Frame-Accurate Caption Generator.
Synthesizes cinematic voiceover via ElevenLabs API (/with-timestamps endpoint)
and converts character alignments into CaptionToken format for Remotion.
"""

import argparse
import base64
import json
import math
import os
import re
import shutil
import sys
import urllib.error
import urllib.request
from pathlib import Path

# Voice Registry
DEFAULT_VOICE = "onwK4e9ZLuTAKqWW03F9"  # Daniel (Authoritative British Broadcaster)
FALLBACK_VOICE = "nPczCjzI2devNBz1zQrb" # Brian (Deep Cinematic Documentary)

VOICE_NAMES = {
    "onwK4e9ZLuTAKqWW03F9": "Daniel (British Broadcaster)",
    "nPczCjzI2devNBz1zQrb": "Brian (Deep Documentary)",
    "pNInz6obpgDQGcFmaJgB": "Adam (Warm Narrative)",
    "JBFqnCBsd6RMkjVDRZzb": "George (British Intellectual)",
    "ErXwobaYiN019PkySvjV": "Antoni (Modern & Energetic)",
    "IKne3meq5aSn9XLyUdCD": "Charlie (Conversational)",
}

def get_api_key() -> str:
    # 1. Check environment variable
    key = os.environ.get("ELEVENLABS_API_KEY")
    if key:
        return key

    # 2. Check .env file in workspace root
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ELEVENLABS_API_KEY="):
                raw_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                if raw_key.startswith("sk_"):
                    return raw_key
                elif len(raw_key) == 32:
                    return f"sk_8be28e9b0846d198{raw_key}"
                return raw_key

    # 3. Fallback to confirmed key
    return "sk_8be28e9b0846d198e4330c27aeeddbe247ce7098fa0ab9d5"

def parse_alignment_to_tokens(characters: list, starts: list, ends: list) -> list:
    """Group character alignments into word tokens with millisecond bounds."""
    tokens = []
    current_chars = []
    word_start_ms = None

    for i, (char, c_start, c_end) in enumerate(zip(characters, starts, ends)):
        if char.isspace() or char in "\n\r\t":
            if current_chars:
                token_text = "".join(current_chars).strip()
                if token_text:
                    tokens.append({
                        "text": token_text,
                        "startMs": round(word_start_ms),
                        "endMs": round(c_end * 1000),
                        "isEmphasized": token_text.isupper() or any(c in token_text for c in "$%0123456789"),
                    })
                current_chars = []
                word_start_ms = None
        else:
            if word_start_ms is None:
                word_start_ms = c_start * 1000
            current_chars.append(char)

    if current_chars:
        token_text = "".join(current_chars).strip()
        if token_text:
            tokens.append({
                "text": token_text,
                "startMs": round(word_start_ms if word_start_ms is not None else 0),
                "endMs": round(ends[-1] * 1000),
                "isEmphasized": token_text.isupper() or any(c in token_text for c in "$%0123456789"),
            })

    return tokens

def synthesize_elevenlabs(
    script_path: str,
    audio_path: str,
    captions_path: str,
    voice_id: str = DEFAULT_VOICE,
    stability: float = 0.38,
    similarity_boost: float = 0.85,
    style: float = 0.15,
):
    api_key = get_api_key()
    if not api_key:
        print("Error: Missing ElevenLabs API Key", file=sys.stderr)
        sys.exit(1)

    script_file = Path(script_path)
    if not script_file.exists():
        print(f"Error: Script file not found: {script_path}", file=sys.stderr)
        sys.exit(1)

    text = script_file.read_text(encoding="utf-8").strip()
    if not text:
        print("Error: Script file is empty", file=sys.stderr)
        sys.exit(1)

    voice_label = VOICE_NAMES.get(voice_id, voice_id)
    print(f"Synthesizing with ElevenLabs | Voice: {voice_label}")
    print(f"Text length: {len(text)} characters (~{len(text.split())} words)")
    print(f"Settings: stability={stability}, similarity={similarity_boost}, style={style}")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps"
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost,
            "style": style,
            "use_speaker_boost": True,
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "User-Agent": "AntigravityRemotionEngine/1.0",
        }
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8", errors="ignore")
        print(f"ElevenLabs API Error ({e.code}): {error_msg}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Connection Error: {e}", file=sys.stderr)
        sys.exit(1)

    # 1. Decode audio
    audio_base64 = data.get("audio_base64")
    if not audio_base64:
        print("Error: No audio data returned by ElevenLabs", file=sys.stderr)
        sys.exit(1)

    audio_bytes = base64.b64decode(audio_base64)
    audio_file = Path(audio_path)
    audio_file.parent.mkdir(parents=True, exist_ok=True)
    audio_file.write_bytes(audio_bytes)
    print(f"Audio saved to: {audio_file} ({len(audio_bytes):,} bytes)")

    # 2. Extract alignments
    alignment = data.get("alignment", {})
    chars = alignment.get("characters", [])
    starts = alignment.get("character_start_times_seconds", [])
    ends = alignment.get("character_end_times_seconds", [])

    tokens = parse_alignment_to_tokens(chars, starts, ends)
    captions_file = Path(captions_path)
    captions_file.parent.mkdir(parents=True, exist_ok=True)
    captions_file.write_text(json.dumps(tokens, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Word tokens saved to: {captions_file} ({len(tokens)} words aligned)")

    total_duration_sec = ends[-1] if ends else 0.0
    total_frames = math.ceil(total_duration_sec * 30)
    print(f"Total Audio Duration: {total_duration_sec:.2f}s (~{total_frames} frames at 30fps)")

    return total_duration_sec, total_frames

def main():
    parser = argparse.ArgumentParser(description="ElevenLabs Voice Synthesis for Remotion")
    parser.add_argument("--slug", default="002-debt-clock", help="Video episode slug")
    parser.add_argument("--voice", default=DEFAULT_VOICE, help="ElevenLabs Voice ID")
    parser.add_argument("--stability", type=float, default=0.38, help="Voice stability (0.0 - 1.0)")
    parser.add_argument("--similarity", type=float, default=0.85, help="Similarity boost (0.0 - 1.0)")
    parser.add_argument("--style", type=float, default=0.15, help="Style exaggeration (0.0 - 1.0)")
    args = parser.parse_args()

    slug = args.slug
    # Prefer episodes/<slug> (template engine); fall back to legacy videos/<slug>
    episode_dir = Path(f"episodes/{slug}")
    if not (episode_dir / "script.txt").exists():
        legacy = Path(f"videos/{slug}")
        if (legacy / "script.txt").exists():
            episode_dir = legacy
    script_path = episode_dir / "script.txt"
    video_audio = episode_dir / "narration.mp3"
    public_audio = Path(f"public/{slug}/narration.mp3")
    video_captions = episode_dir / "captions.json"
    public_captions = Path(f"public/{slug}/captions.json")
    content_json_path = episode_dir / "content.json"

    duration_sec, frames = synthesize_elevenlabs(
        script_path=str(script_path),
        audio_path=str(video_audio),
        captions_path=str(video_captions),
        voice_id=args.voice,
        stability=args.stability,
        similarity_boost=args.similarity,
        style=args.style,
    )

    # Mirror to public directory for Remotion staticFile()
    public_audio.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(video_audio, public_audio)
    print(f"Mirrored audio to public: {public_audio}")

    public_captions.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(video_captions, public_captions)
    print(f"Mirrored captions to public: {public_captions}")

    # Update content.json narration + totalDurationInFrames (scene beats still need manual rebalance)
    if content_json_path.exists():
        content = json.loads(content_json_path.read_text(encoding="utf-8"))
        content["narration"] = {
            "engine": "elevenlabs",
            "voiceId": VOICE_NAMES.get(args.voice, args.voice),
            "audioFile": f"{slug}/narration.mp3",
            "durationInSeconds": round(duration_sec, 2),
        }
        previous_total = content.get("totalDurationInFrames")
        content["totalDurationInFrames"] = frames
        content_json_path.write_text(json.dumps(content, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Updated metadata in: {content_json_path}")
        if previous_total != frames:
            print(f"Synced totalDurationInFrames: {previous_total} → {frames}")
            scene_sum = sum(s.get("durationInFrames", 0) for s in content.get("scenes", []))
            if scene_sum != frames:
                print(
                    f"Warning: scene frame sum ({scene_sum}) != audio frames ({frames}). "
                    "Rebalance beat durations, then run: npx tsx scripts/validate-episode.ts "
                    f"--slug {slug}"
                )

    print("\nSynthesis Complete!")
    print(f"Validate: npx tsx scripts/validate-episode.ts --slug {slug}")

if __name__ == "__main__":
    main()
