#!/usr/bin/env python3
"""Build a self-contained page and an optimized Netlify artifact."""

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
product_refs = set(re.findall(r'(?:data-src|src)="(assets/products/[^"]+)"', html))
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

# The root index.html must work when the host serves no files except that page.
standalone_html = html
for ref in sorted(product_refs):
    reference_markers = [f'{attribute}="{ref}"' for attribute in ("src", "data-src")]
    if not any(marker in standalone_html for marker in reference_markers):
        raise SystemExit(f"Could not inline product image reference: {ref}")
    encoded_image = b64encode((ROOT / ref).read_bytes()).decode("ascii")
    data_uri = f"data:image/webp;base64,{encoded_image}"
    for marker in reference_markers:
        standalone_html = standalone_html.replace(marker, marker.replace(ref, data_uri))
output_path.write_text(standalone_html, encoding="utf-8")

# Netlify gets a smaller initial HTML document plus separately cached WebP assets.
if dist_root.exists():
    rmtree(dist_root)
dist_root.mkdir(parents=True, exist_ok=True)
dist_path.write_text(html, encoding="utf-8")
if product_assets.is_dir():
    copytree(product_assets, dist_root / "assets" / "products")

image_bytes = sum(path.stat().st_size for path in product_assets.glob("*.webp"))
print(
    f"Built standalone {output_path.name} ({output_path.stat().st_size:,} bytes) and "
    f"Netlify dist/ ({dist_path.stat().st_size:,} bytes + {image_bytes:,} bytes of WebP assets)"
)
