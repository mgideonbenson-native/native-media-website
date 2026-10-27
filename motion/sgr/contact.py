"""Contact sheet of rendered stills: python3 contact.py out/sheet.jpg out/still-a.png out/still-b.png ..."""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
cols, w = 2, 960
h = w * 9 // 16
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w + (cols + 1) * 8, rows * (h + 8) + 8), (40, 40, 40))
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8)
    sheet.paste(im, (x, y))
    ImageDraw.Draw(sheet).text((x + 8, y + 6), f.split('still-')[-1].replace('.png', ' s'), fill=(255, 255, 0))
sheet.save(out, quality=88)
