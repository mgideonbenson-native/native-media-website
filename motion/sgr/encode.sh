#!/usr/bin/env bash
# Mux the silent master with the score and encode the web deliverables into public/media/motion.
# Run after: render.mjs --video and audio.py (see PRODUCTION.md → How to rebuild).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$here/../../public/media/motion"
name="tanzania-sgr-2026"
master="$here/out/sgr-master-silent.mp4"
score="$here/out/sgr-score.wav"
mkdir -p "$out"

# 1080p H.264 + AAC, fast start for the web
ffmpeg -y -loglevel error -i "$master" -i "$score" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -movflags +faststart \
  -c:a aac -b:a 192k -shortest "$out/$name-1080.mp4"
# 720p H.264 and VP9 fallbacks
ffmpeg -y -loglevel error -i "$master" -i "$score" -map 0:v -map 1:a -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k -shortest "$out/$name-720.mp4"
ffmpeg -y -loglevel error -i "$master" -i "$score" -map 0:v -map 1:a -vf scale=1280:720:flags=lanczos \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 -c:a libopus -b:a 112k -shortest "$out/$name-720.webm"
# Poster (title frame) and social image (1200 x 630, centre crop of the same frame)
ffmpeg -y -loglevel error -ss 11.8 -i "$master" -frames:v 1 -vf scale=1600:900:flags=lanczos -q:v 3 "$out/$name-poster.jpg"
ffmpeg -y -loglevel error -ss 11.8 -i "$master" -frames:v 1 -vf "scale=1200:675:flags=lanczos,crop=1200:630:0:0" -q:v 3 "$out/$name-og.jpg"
ls -la "$out" | grep "$name"
