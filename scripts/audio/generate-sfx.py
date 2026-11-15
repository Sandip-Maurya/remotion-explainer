# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""
Pristine SFX Sound Synthesizer for Remotion Explainer Videos.
Generates broadcast-grade 16-bit 44.1kHz PCM WAV audio effects using pure mathematics.
Zero external audio dependencies required.
"""
import math
import os
import random
import struct
import wave

SAMPLE_RATE = 44100

def write_wav(filename: str, samples: list[float]):
    """Writes a list of normalized [-1.0, 1.0] float samples to a 16-bit mono WAV file."""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, "w") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        
        # Clamp and convert to 16-bit integer PCM
        raw_bytes = bytearray()
        for s in samples:
            clamped = max(-1.0, min(1.0, s))
            int_val = int(clamped * 32767.0)
            raw_bytes.extend(struct.pack("<h", int_val))
        wav_file.writeframes(raw_bytes)
    print(f"Generated: {filename} ({len(samples)} samples, {len(samples)/SAMPLE_RATE:.2f}s)")

def generate_pop(filepath: str):
    """Snappy UI pop sound: fast pitch drop with exponential decay (0.09s)."""
    duration = 0.09
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    phase = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = i / num_samples
        # Exponential pitch drop from 1100 Hz down to 220 Hz
        freq = 220.0 + 880.0 * math.exp(-progress * 8.0)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        # Snappy attack (2ms) then exponential decay
        envelope = (1.0 - math.exp(-t * 1500.0)) * math.exp(-progress * 7.5)
        # Subtle second harmonic for warmth
        val = (math.sin(phase) + 0.25 * math.sin(phase * 2.0)) * envelope * 0.85
        samples.append(val)
    write_wav(filepath, samples)

def generate_whoosh(filepath: str):
    """Airy cinematic whoosh for transitions (0.32s)."""
    duration = 0.32
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    # Generate smoothed noise sweep
    random.seed(42)
    noise_buffer = [random.uniform(-1.0, 1.0) for _ in range(num_samples)]
    # Simple low-pass filter
    filtered = []
    last = 0.0
    for i, n in enumerate(noise_buffer):
        t = i / num_samples
        # Cutoff sweeps up then down
        alpha = 0.05 + 0.35 * math.sin(t * math.pi)
        curr = last + alpha * (n - last)
        filtered.append(curr)
        last = curr
        
    for i in range(num_samples):
        t = i / num_samples
        # Smooth Gaussian-like bell envelope
        bell = math.sin(t * math.pi) ** 2.2
        # Add subtle pitching tone for body
        pitch_phase = 2.0 * math.pi * (180.0 + 260.0 * math.sin(t * math.pi)) * (i / SAMPLE_RATE)
        tone = math.sin(pitch_phase) * 0.25
        val = (filtered[i] * 0.75 + tone) * bell * 0.9
        samples.append(val)
    write_wav(filepath, samples)

def generate_sub_drop(filepath: str):
    """Deep cinematic sub-bass drop / impact (1.1s)."""
    duration = 1.1
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    phase = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = i / num_samples
        # Pitch sweeps from 90 Hz down to 28 Hz
        freq = 28.0 + 62.0 * math.exp(-progress * 4.5)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        # Attack in 10ms, then long cinematic decay
        attack = min(1.0, t / 0.012)
        decay = math.exp(-progress * 3.8)
        # Soft saturation / warmth (tanh-like shaping)
        raw_sin = math.sin(phase) + 0.15 * math.sin(phase * 2.0)
        saturated = math.tanh(raw_sin * 1.4)
        val = saturated * attack * decay * 0.95
        samples.append(val)
    write_wav(filepath, samples)

def generate_cash_register(filepath: str):
    """Crisp dual-tone financial chime / cha-ching effect (0.45s)."""
    duration = 0.45
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # First high chime bell (starts at t=0)
        env1 = math.exp(-t * 9.0)
        bell1 = (
            math.sin(2.0 * math.pi * 1760.0 * t) * 0.5
            + math.sin(2.0 * math.pi * 2637.0 * t) * 0.3
            + math.sin(2.0 * math.pi * 3520.0 * t) * 0.2
        ) * env1
        
        # Second bell offset by 65ms (harmonic fifth higher)
        t2 = t - 0.065
        bell2 = 0.0
        if t2 > 0:
            env2 = math.exp(-t2 * 8.0)
            bell2 = (
                math.sin(2.0 * math.pi * 2217.0 * t2) * 0.55
                + math.sin(2.0 * math.pi * 3322.0 * t2) * 0.35
            ) * env2
            
        val = (bell1 * 0.6 + bell2 * 0.75) * 0.85
        samples.append(val)
    write_wav(filepath, samples)

def generate_chime(filepath: str):
    """Bright glass epiphany chime / discovery bell (0.75s)."""
    duration = 0.75
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    # Major triad chord: C6 (1046 Hz), E6 (1318 Hz), G6 (1568 Hz)
    partials = [(1046.5, 0.4), (1318.5, 0.3), (1567.9, 0.25), (2093.0, 0.15)]
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 5.5)
        sound = sum(math.sin(2.0 * math.pi * freq * t) * amp for freq, amp in partials)
        val = sound * env * 0.85
        samples.append(val)
    write_wav(filepath, samples)

def generate_clock_tick(filepath: str):
    """Precise mechanical clock tick / transient click (0.04s)."""
    duration = 0.04
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(123)
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Very fast decay
        env = math.exp(-t * 220.0)
        click = math.sin(2.0 * math.pi * 1400.0 * t) * 0.7 + random.uniform(-0.3, 0.3)
        val = click * env * 0.8
        samples.append(val)
    write_wav(filepath, samples)

def main():
    out_dir = os.path.join("public", "sfx")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Synthesizing broadcast SFX audio pack into: {out_dir}")
    generate_pop(os.path.join(out_dir, "pop.wav"))
    generate_whoosh(os.path.join(out_dir, "whoosh.wav"))
    generate_sub_drop(os.path.join(out_dir, "sub-drop.wav"))
    generate_cash_register(os.path.join(out_dir, "cash-register.wav"))
    generate_chime(os.path.join(out_dir, "chime.wav"))
    generate_clock_tick(os.path.join(out_dir, "clock-tick.wav"))
    print("All SFX successfully generated!")

if __name__ == "__main__":
    main()
