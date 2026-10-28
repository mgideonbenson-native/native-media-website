#!/usr/bin/env bash
# Mux the v2 silent master with the score and encode web deliverables into public/media/motion.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"; out="$here/../../public/media/motion"; name="tanzania-sgr-v2-2026"
master="$here/out/sgr2-silent.mp4"; score="$here/out/sgr2-score.wav"
ffmpeg -y -loglevel error -i "$master" -i "$score" -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 160k -shortest "$out/$name-720.mp4"
ffmpeg -y -loglevel error -i "$master" -i "$score" -map 0:v -map 1:a -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -c:a libopus -b:a 112k -shortest "$out/$name-720.webm"
ffmpeg -y -loglevel error -ss 31 -i "$master" -frames:v 1 -q:v 3 "$out/$name-poster.jpg"
ffmpeg -y -loglevel error -ss 31 -i "$master" -frames:v 1 -vf "scale=1200:675,crop=1200:630:0:20" -q:v 3 "$out/$name-og.jpg"
ls -la "$out" | grep "$name"
