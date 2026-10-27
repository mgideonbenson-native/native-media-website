#!/usr/bin/env bash
# Render the three proof-of-concept shots (resumable: finished frames are skipped), then composite.
# PY: a Python with the `bpy` module (pip install bpy==5.2.3 on Python 3.13). Scale/samples tuned for a 4-core CPU;
# on a GPU machine, drop --pct and raise --samples (see PRODUCTION.md).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"; cd "$here"
PY="${PY:-python3}"
PCT="${PCT:-83}"          # 83 % of 1920x1080 = 1594x896, upscaled to 1080p in comp.py
"$PY" shot1_track.py   -- --frames 1-105 --pct "$PCT" --samples "${S1:-12}"
"$PY" shot2_terrain.py -- --frames 1-120 --pct "$PCT" --samples "${S2:-8}"
"$PY" shot3_train.py   -- --frames 1-120 --pct "$PCT" --samples "${S3:-12}"
