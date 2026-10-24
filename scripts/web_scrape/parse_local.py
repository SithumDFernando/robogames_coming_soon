from bs4 import BeautifulSoup
import re

with open(r"C:\Users\sithu\.gemini\antigravity-ide\brain\778c1229-8e3c-4cc2-8f3d-2b507dc8194b\.system_generated\steps\4\content.md", "r", encoding="utf-8") as f:
    text = f.read()

soup = BeautifulSoup(text, "html.parser")

for s in soup(['script', 'style', 'svg']):
    s.decompose()

# Print all text content neatly
def clean(t):
    return re.sub(r'\s+', ' ', t).strip()

lines = [clean(l) for l in soup.get_text(separator="\n").split("\n") if clean(l)]
for line in lines:
    print(line)
