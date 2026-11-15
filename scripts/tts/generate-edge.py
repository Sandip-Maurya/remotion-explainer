# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "edge-tts>=6.1.0",
# ]
# ///

"""
Microsoft Edge Neural TTS Audio & Millisecond-Precision Caption Generator.
Extracts streaming audio into MP3 and captures WordBoundary events into JSON
conforming to CaptionToken schema for Remotion (@remotion/captions).
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"  # Deep, calm, authoritative
# Other great options:
# "en-US-GuyNeural" (energetic, dynamic)
# "en-US-JennyNeural" (clear, professional female)
# "en-US-AriaNeural" (warm, expressive female)

async def generate(
    script_path: str,
    audio_path: str,
    captions_path: str,
    voice: str = DEFAULT_VOICE,
    rate: str = "+0%",
    pitch: str = "+0Hz",
    boundary: str = "WordBoundary",
):
    script_file = Path(script_path)
    if not script_file.exists():
        print(f"Error: Script file not found at {script_path}", file=sys.stderr)
        sys.exit(1)

    text = script_file.read_text(encoding="utf-8").strip()
    if not text:
        print("Error: Script file is empty", file=sys.stderr)
        sys.exit(1)

    word_count = len(text.split())
    print(f"Synthesizing {word_count} words using voice '{voice}' (boundary: {boundary})...")

    # Important: edge-tts defaults boundary to "SentenceBoundary".
    # We explicitly request "WordBoundary" for kinetic word-by-word subtitles.
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        boundary=boundary,
    )

    subtitles = []
    audio_bytes = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            # Offset & duration are given in 100-nanosecond ticks (1 tick = 0.0001 ms)
            start_ms = round(chunk["offset"] / 10000)
            end_ms = round((chunk["offset"] + chunk["duration"]) / 10000)
            word_text = chunk["text"]

            subtitles.append({
                "text": word_text,
                "startMs": start_ms,
                "endMs": end_ms,
                "isEmphasized": False,
            })

    # Ensure parent output directories exist
    Path(audio_path).parent.mkdir(parents=True, exist_ok=True)
    Path(captions_path).parent.mkdir(parents=True, exist_ok=True)

    with open(audio_path, "wb") as f:
        f.write(audio_bytes)

    with open(captions_path, "w", encoding="utf-8") as f:
        json.dump(subtitles, f, indent=2, ensure_ascii=False)

    total_duration_sec = subtitles[-1]["endMs"] / 1000 if subtitles else 0
    frames_at_30fps = round(total_duration_sec * 30)

    print(f"Audio generated successfully: {audio_path} ({len(audio_bytes)} bytes)")
    print(f"Captions generated: {captions_path} ({len(subtitles)} word boundaries)")
    print(f"Measured audio duration: {total_duration_sec:.2f}s (~{frames_at_30fps} frames at 30fps)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate TTS audio and word timestamps via Edge-TTS")
    parser.add_argument("--script", required=True, help="Input script text file")
    parser.add_argument("--audio", required=True, help="Output MP3 file")
    parser.add_argument("--captions", required=True, help="Output JSON captions file")
    parser.add_argument("--voice", default=DEFAULT_VOICE, help="Microsoft Neural voice ID")
    parser.add_argument("--rate", default="+0%", help="Speed adjustment (e.g. +5%, -5%)")
    parser.add_argument("--pitch", default="+0Hz", help="Pitch adjustment")
    parser.add_argument("--boundary", default="WordBoundary", choices=["WordBoundary", "SentenceBoundary"])

    args = parser.parse_args()
    asyncio.run(generate(args.script, args.audio, args.captions, args.voice, args.rate, args.pitch, args.boundary))
