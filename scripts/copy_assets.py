import os
import shutil

base = r"c:\Users\sithu\MyWorks\My Softwares\Robogames2027\robogames_coming_soon"
public_dir = os.path.join(base, "public")
logos_dir = os.path.join(public_dir, "logos")
mascots_dir = os.path.join(public_dir, "mascots")

os.makedirs(logos_dir, exist_ok=True)
os.makedirs(mascots_dir, exist_ok=True)

# Copy logos
logo_mappings = {
    os.path.join(base, "assets", "logos", "RoboGames logo", "Robo_2027_new_no_iesl.svg"): os.path.join(logos_dir, "robogames.svg"),
    os.path.join(base, "assets", "logos", "RoboGames logo", "robogames logo no iesl transparent bg.png"): os.path.join(logos_dir, "robogames.png"),
    os.path.join(base, "assets", "logos", "CSE logo", "CSE Logo.svg"): os.path.join(logos_dir, "cse.svg"),
    os.path.join(base, "assets", "logos", "CSE logo", "cse logo.png"): os.path.join(logos_dir, "cse.png"),
    os.path.join(base, "assets", "logos", "UOM logo", "uom logo.png"): os.path.join(logos_dir, "uom.png"),
    os.path.join(base, "assets", "logos", "IESL Logo", "IESL.svg"): os.path.join(logos_dir, "iesl.svg"),
    os.path.join(base, "assets", "logos", "SLT logo", "slt-log.svg"): os.path.join(logos_dir, "slt.svg"),
}

for src, dst in logo_mappings.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied logo: {os.path.basename(dst)}")

# Copy key mascots
mascot_mappings = {
    os.path.join(base, "assets", "mascots", "Battlebot robot", "battle bot robot waving.png"): os.path.join(mascots_dir, "battlebot_waving.png"),
    os.path.join(base, "assets", "mascots", "Battlebot robot", "Welcoming non rusty.png"): os.path.join(mascots_dir, "battlebot_welcome.png"),
    os.path.join(base, "assets", "mascots", "School Uni robot", "Friendly Green Rover Robot Pointing.png"): os.path.join(mascots_dir, "rover_pointing.png"),
    os.path.join(base, "assets", "mascots", "School Uni robot", "Hovering Mecha Drone with Holographic Tablet.png"): os.path.join(mascots_dir, "drone_tablet.png"),
    os.path.join(base, "assets", "mascots", "School Uni robot", "robot waving uni.png"): os.path.join(mascots_dir, "rover_waving.png"),
}

for src, dst in mascot_mappings.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied mascot: {os.path.basename(dst)}")

print("Asset copying complete!")
