import json
import os

data_path = r"C:\Users\sithu\.gemini\antigravity-ide\brain\778c1229-8e3c-4cc2-8f3d-2b507dc8194b\scratch\scraped_data.json"
with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

out_text_path = r"C:\Users\sithu\.gemini\antigravity-ide\brain\778c1229-8e3c-4cc2-8f3d-2b507dc8194b\scratch\formatted_site_content.md"

with open(out_text_path, "w", encoding="utf-8") as out:
    for path, info in data.items():
        if "error" in info:
            out.write(f"\n# PAGE: {path} (Error: {info['error']})\n\n")
            continue
        out.write(f"\n{'='*60}\n# PAGE: {path}\n")
        out.write(f"**Title**: {info.get('title', '')}\n")
        out.write(f"**Description**: {info.get('description', '')}\n")
        out.write(f"{'='*60}\n\n")
        
        out.write("## Sections:\n")
        for s in info.get("sections", []):
            tag = s.get("tag", "")
            text = s.get("text", "")
            if tag.startswith("h"):
                level = tag[1]
                hashes = "#" * int(level)
                out.write(f"\n{hashes} {text}\n")
            elif tag == "li":
                out.write(f"- {text}\n")
            else:
                out.write(f"{text}\n\n")
                
        out.write("\n## Links:\n")
        seen_links = set()
        for link in info.get("links", []):
            href = link.get("href", "")
            lt = link.get("text", "")
            pair = (lt, href)
            if pair not in seen_links:
                seen_links.add(pair)
                out.write(f"- [{lt}]({href})\n")
        out.write("\n\n")

print(f"Written formatted site content to {out_text_path}")
