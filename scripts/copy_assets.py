import os
import shutil
from PIL import Image

base = r"c:\Users\sithu\MyWorks\My Softwares\Robogames2027\robogames_coming_soon"
public_dir = os.path.join(base, "public")
logos_dir = os.path.join(public_dir, "logos")
mascots_dir = os.path.join(public_dir, "mascots")

os.makedirs(logos_dir, exist_ok=True)
os.makedirs(mascots_dir, exist_ok=True)

# Copy SVG logos directly (already lightweight)
svg_logos = {
    os.path.join(base, "assets", "logos", "RoboGames logo", "Robo_2027_new_no_iesl.svg"): os.path.join(logos_dir, "robogames.svg"),
    os.path.join(base, "assets", "logos", "CSE logo", "CSE Logo.svg"): os.path.join(logos_dir, "cse.svg"),
    os.path.join(base, "assets", "logos", "IESL Logo", "IESL.svg"): os.path.join(logos_dir, "iesl.svg"),
    os.path.join(base, "assets", "logos", "SLT logo", "slt-log.svg"): os.path.join(logos_dir, "slt.svg"),
}

for src, dst in svg_logos.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied SVG logo: {os.path.basename(dst)}")

# Optimize raster logos
if os.path.exists(os.path.join(base, "assets", "logos", "UOM logo", "uom logo.png")):
    uom = Image.open(os.path.join(base, "assets", "logos", "UOM logo", "uom logo.png"))
    uom.resize((250, 300), Image.Resampling.LANCZOS).save(os.path.join(logos_dir, "uom.png"), "PNG", optimize=True)
    print("Optimized UOM logo")

if os.path.exists(os.path.join(base, "assets", "logos", "CSE logo", "cse logo.png")):
    cse = Image.open(os.path.join(base, "assets", "logos", "CSE logo", "cse logo.png"))
    w, h = cse.size
    cse.resize((300, int(h * (300 / w))), Image.Resampling.LANCZOS).save(os.path.join(logos_dir, "cse.png"), "PNG", optimize=True)
    print("Optimized CSE logo")

# Optimize Mascot
mascot_src = os.path.join(base, "assets", "mascots", "Battlebot robot", "battle bot robot waving.png")
if os.path.exists(mascot_src):
    m_img = Image.open(mascot_src)
    m_opt = m_img.resize((600, 600), Image.Resampling.LANCZOS)
    m_opt.save(os.path.join(mascots_dir, "battlebot_waving.webp"), "WEBP", quality=92, method=6)
    m_opt.save(os.path.join(mascots_dir, "battlebot_waving.png"), "PNG", optimize=True)
    print("Optimized battlebot_waving (WebP & PNG)")

print("Asset copying and optimization complete!")

