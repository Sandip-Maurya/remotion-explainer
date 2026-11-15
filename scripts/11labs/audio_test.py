import urllib.request
import urllib.error
import json
from pathlib import Path

key = Path('.env').read_text(encoding='utf-8').split('=', 1)[1].strip()
if not key.startswith('sk_'):
    key = f'sk_8be28e9b0846d198{key}'

voices_to_test = [
    {"name": "george", "id": "JBFqnCBsd6RMkjVDRZzb", "desc": "British documentary & intellectual"},
    {"name": "antoni", "id": "ErXwobaYiN019PkySvjV", "desc": "Modern, crisp & energetic"},
    {"name": "brian", "id": "nPczCjzI2devNBz1zQrb", "desc": "Deep cinematic gravitas & documentary"},
    {"name": "charlie", "id": "IKne3meq5aSn9XLyUdCD", "desc": "Casual, natural & conversational"},
    {"name": "liam", "id": "TX3LPaxmHKxFdv7VOQHJ", "desc": "Young, upbeat, high-energy social media explainer"},
    {"name": "daniel", "id": "onwK4e9ZLuTAKqWW03F9", "desc": "Authoritative British news broadcaster"},
]

text = "Imagine this: thirty-five trillion dollars."

for v in voices_to_test:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{v['id']}"
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.38,
            "similarity_boost": 0.85,
            "style": 0.15,
            "use_speaker_boost": True
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'xi-api-key': key,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            audio_data = resp.read()
            out_file = Path(f"public/audio/test-{v['name']}.mp3")
            out_file.write_bytes(audio_data)
            print(f"Generated {v['name']}: {out_file} ({len(audio_data)} bytes)")
    except urllib.error.HTTPError as e:
        print(f"Failed {v['name']}: HTTP {e.code} - {e.read().decode('utf-8')[:150]}")
    except Exception as e:
        print(f"Error {v['name']}: {e}")

