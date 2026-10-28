#!/usr/bin/env python3
"""Bundle the static site into one portable HTML file for preview/deployment."""

from base64 import b64encode
from pathlib import Path

ROOT = Path(__file__).resolve().parent
template_path = ROOT / "index.template.html"
output_path = ROOT / "index.html"
dist_path = ROOT / "dist" / "index.html"

html = template_path.read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "script.js").read_text(encoding="utf-8")
logo = b64encode((ROOT / "assets" / "rcppjsc-logo.webp").read_bytes()).decode("ascii")

replacements = {
    "{{CSS}}": css,
    "{{JS}}": js,
    "{{LOGO_DATA}}": logo,
}
for marker, value in replacements.items():
    if html.count(marker) != 1:
        raise SystemExit(f"Expected exactly one {marker} marker in {template_path.name}")
    html = html.replace(marker, value)

output_path.write_text(html, encoding="utf-8")
dist_path.parent.mkdir(parents=True, exist_ok=True)
dist_path.write_text(html, encoding="utf-8")
print(f"Bundled standalone page to {output_path.name} and dist/{dist_path.name} ({output_path.stat().st_size:,} bytes)")
