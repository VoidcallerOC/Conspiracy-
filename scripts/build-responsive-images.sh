#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT_DIR="assets/img/optimized"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

build_variants() {
  local source="$1"
  local widths="$2"
  local name
  name="$(basename "${source%.jpg}")"

  IFS=',' read -r -a width_list <<< "$widths"
  for width in "${width_list[@]}"; do
    vips thumbnail "$source" "$OUT_DIR/${name}-${width}.webp[Q=80,effort=6,strip]" "$width" --size down
    ffmpeg -hide_banner -nostdin -loglevel error -y -i "$source" \
      -vf "scale=${width}:-2:flags=lanczos" \
      -frames:v 1 -map_metadata -1 -c:v libaom-av1 -still-picture 1 -crf 30 -cpu-used 6 \
      "$OUT_DIR/${name}-${width}.avif"
  done
}

while IFS='|' read -r source widths; do
  [[ -z "$source" ]] && continue
  build_variants "$source" "$widths"
done <<'IMAGES'
assets/img/gear5-tall.jpg|480,640,830
assets/img/gear5-wide.jpg|640,960,1120
assets/img/store-case.jpg|480,768,1200
assets/img/gallery-figures.jpg|480,768,1150
assets/img/store-counter.jpg|480,768,1300
assets/img/store-figures.jpg|480,768,1350
assets/img/store-luffy.jpg|480,768,1300
assets/img/gallery-art.jpg|480,768,1170
assets/img/gallery-merch.jpg|480,768,1170
assets/img/play-hall.jpg|480,768,1169
assets/img/event-room.jpg|480,768,1168
assets/img/play-room.jpg|480,768,1168
assets/img/pulls/pokemon.jpg|240,400,640
assets/img/pulls/onepiece.jpg|240,400,640
assets/img/pulls/mtg.jpg|240,400,640
assets/img/pulls/yugioh.jpg|240,400,640
assets/img/pulls/figures.jpg|240,400,640
assets/img/pulls/funko.jpg|240,400,640
assets/img/pulls/manga.jpg|240,400,640
assets/img/pulls/snacks.jpg|240,400,640
IMAGES

printf 'Created %s responsive image files in %s.\n' "$(find "$OUT_DIR" -type f | wc -l)" "$OUT_DIR"
