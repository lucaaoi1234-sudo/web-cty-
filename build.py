#!/usr/bin/env python3
"""Bundle the page and copy lazy-loaded product images for deployment."""

import re
from base64 import b64encode
from pathlib import Path
from shutil import copytree, rmtree

ROOT = Path(__file__).resolve().parent
template_path = ROOT / "index.template.html"
output_path = ROOT / "index.html"
dist_root = ROOT / "dist"
dist_path = dist_root / "index.html"
product_assets = ROOT / "assets" / "products"

html = template_path.read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "script.js").read_text(encoding="utf-8")
logo = b64encode((ROOT / "assets" / "rcppjsc-logo.webp").read_bytes()).decode("ascii")
product_refs = set(re.findall(r'data-src="(assets/products/[^"]+)"', html))
missing_products = [ref for ref in sorted(product_refs) if not (ROOT / ref).is_file()]
if missing_products:
    raise SystemExit(f"Missing product images: {', '.join(missing_products)}")

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
if dist_root.exists():
    rmtree(dist_root)
dist_root.mkdir(parents=True, exist_ok=True)
dist_path.write_text(html, encoding="utf-8")
if product_assets.is_dir():
    copytree(product_assets, dist_root / "assets" / "products")
print(f"Built standalone page to {output_path.name} and Netlify artifact dist/ ({output_path.stat().st_size:,} bytes + product images)")
