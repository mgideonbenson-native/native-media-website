"""
Score and sound design for the SGR film, synthesised (no samples, no third-party audio).
Writes motion/sgr/out/sgr-score.wav (48 kHz stereo, 120 s).

The mix is deliberately low and kept mostly below ~1 kHz so a narrator can sit on top:
pads around -26 dBFS RMS, effects shorter and quieter than speech. Cue times match film.js / PRODUCTION.md.

    python3 motion/sgr/audio.py
"""
import os
import wave
import numpy as np

SR, DUR = 48000, 120.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
out = np.zeros((N, 2))


def env(a, b, fi, fo):
    """0..1 envelope: rises over fi seconds from a, falls over fo seconds to b (smoothstep)."""
    e = np.clip((t - a) / fi, 0, 1) * np.clip((b - t) / fo, 0, 1)
    return e * e * (3 - 2 * e)


def lowpass(x, cutoff):
    """FFT brick-ish low-pass with a soft knee (fine for offline synthesis)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4))
    return np.fft.irfft(X, len(x))


def note(freq, start, end, amp, fi=2.5, fo=3.0, detune=0.25):
    """Soft pad voice: three detuned partials with gentle harmonics, slow swell."""
    e = env(start, end, fi, fo)
    v = np.zeros(N)
    for d, ph in ((-detune, 0.0), (0.0, 1.3), (detune, 2.1)):
        f = freq + d
        v += np.sin(2 * np.pi * f * t + ph) + 0.28 * np.sin(4 * np.pi * f * t + ph) + 0.08 * np.sin(6 * np.pi * f * t)
    return v * e * amp / 3


def hz(n):  # MIDI note to Hz
    return 440 * 2 ** ((n - 69) / 12)


# ── Score: modal pad progression, one chord colour per chapter ─────────────
# D minor (hook) → Bb maj7 (map) → F (engineering) → G minor 7 (data) → Bb → C (region) → D minor → F (close)
chords = [
    (0.0, 16.0, [38, 50, 57, 62, 64]),      # Dm add9
    (14.8, 36.0, [34, 46, 53, 57, 62]),     # Bbmaj7
    (35.0, 61.0, [41, 53, 60, 64, 69]),     # F add9 (bright, technical)
    (60.0, 86.4, [43, 55, 58, 62, 65]),     # Gm7
    (85.4, 96.0, [34, 46, 53, 58, 62]),     # Bb
    (95.0, 106.0, [36, 48, 55, 60, 64]),    # C
    (104.8, 114.5, [38, 50, 57, 60, 65]),   # Dm7
    (113.5, 120.0, [41, 53, 57, 60, 65]),   # F, resolving under the final card
]
pad = np.zeros(N)
for a, b, notes in chords:
    for i, n in enumerate(notes):
        pad += note(hz(n), a, min(b, DUR), 0.11 if i == 0 else 0.06, fi=2.2, fo=2.6)
pad = lowpass(pad, 1400)
# slow stereo movement
pan = 0.5 + 0.18 * np.sin(2 * np.pi * t / 17)
out[:, 0] += pad * (1.1 - pan)
out[:, 1] += pad * (0.5 + pan)

# a quiet pulse under the data chapter (1:00–1:25): muted low plucks at 84 bpm
beat = 60 / 84
pulse = np.zeros(N)
for k in np.arange(60.6, 85.6, beat):
    i = int(k * SR)
    L = int(0.5 * SR)
    seg = t[:L]
    p = np.sin(2 * np.pi * hz(43) * seg) * np.exp(-seg * 9)
    pulse[i:i + L] += p[: max(0, min(L, N - i))] * 0.12
out += lowpass(pulse, 600)[:, None]

# ── Sound design ───────────────────────────────────────────────────────────
brown = np.cumsum(rng.standard_normal(N))
brown = brown - lowpass(brown, 8)  # remove drift
brown /= np.max(np.abs(brown))

# Opening: train rumble swelling as the cars pass (0:01–0:15), with a soft whoosh at each mast (every 2 s)
rumble = lowpass(brown, 180) * env(1.0, 15.0, 2.5, 2.0) * 0.55
air = bandpass(rng.standard_normal(N), 300, 2500) * env(1.2, 14.6, 2.0, 1.5) * 0.025
out[:, 0] += rumble + air
out[:, 1] += rumble * 0.9 + air
for m in np.arange(1.0, 14.5, 2.0):
    w = np.exp(-((t - m) ** 2) / 0.02)
    sw = bandpass(rng.standard_normal(N), 200, 1500) * w * 0.05
    out[:, 0] += sw * 1.2
    out[:, 1] += sw * 0.6

# Transitions: filtered-noise swells into each chapter
for c in (14.6, 35.0, 60.0, 85.4, 104.8):
    sw = bandpass(rng.standard_normal(N), 150, 3000)
    e = np.clip((t - (c - 1.2)) / 1.2, 0, 1) ** 2 * np.exp(-np.clip(t - c, 0, None) * 4)
    out += (sw * e * 0.06)[:, None]

# Counters and reveals: soft wooden ticks (corridor 0:25, fleet 0:54, riders 1:09, freight 1:17)
def ticks(a, b, n, amp=0.05, f=1800):
    for k in np.linspace(a, b, n):
        i, L = int(k * SR), int(0.03 * SR)
        seg = t[:L]
        s = np.sin(2 * np.pi * f * seg) * np.exp(-seg * 220) * amp
        out[i:i + L, 0] += s
        out[i:i + L, 1] += s


ticks(24.8, 27.2, 12)
ticks(54.4, 55.8, 8)
ticks(68.9, 72.2, 14)
ticks(77.4, 79.0, 8)
# map line draws: a low "string" under each new line
for a in (17.0, 21.0, 24.6, 29.0, 95.0, 99.8):
    out += (note(hz(26 + 12), a, a + 2.4, 0.08, fi=0.15, fo=1.6) * 1.0)[:, None]

# Closing: distant train approaching (1:45–1:58), then a low resolving hit under the final card
approach = lowpass(brown, 140) * np.clip((t - 105.0) / 12.4, 0, 1) ** 2.2 * env(105.0, 118.2, 1.0, 1.0) * 0.6
out[:, 0] += approach
out[:, 1] += approach
hit = np.zeros(N)
i0 = int(116.6 * SR)
seg = t[: N - i0]
hit[i0:] = (np.sin(2 * np.pi * hz(29) * seg) + 0.5 * np.sin(2 * np.pi * hz(41) * seg)) * np.exp(-seg * 0.9) * 0.22
out += lowpass(hit, 300)[:, None]

# ── Master: fade in/out, level, gentle limiter ────────────────────────────
out *= (np.clip(t / 1.5, 0, 1) * np.clip((DUR - t) / 2.5, 0, 1))[:, None]
target_rms = 10 ** (-26 / 20)
out *= target_rms / np.sqrt(np.mean(out ** 2))
out = np.tanh(out * 1.4) / 1.4
peak = np.max(np.abs(out))
if peak > 0.89:
    out *= 0.89 / peak

os.makedirs(os.path.join(os.path.dirname(__file__), 'out'), exist_ok=True)
path = os.path.join(os.path.dirname(__file__), 'out', 'sgr-score.wav')
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print(path, f'rms {20 * np.log10(np.sqrt(np.mean(out ** 2))):.1f} dBFS, peak {20 * np.log10(np.max(np.abs(out))):.1f} dBFS')
