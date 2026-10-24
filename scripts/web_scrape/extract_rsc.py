import urllib.request
import ssl
from bs4 import BeautifulSoup
import re
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = {
    "home": "https://robo.cse.mrt.ac.lk/",
    "school": "https://robo.cse.mrt.ac.lk/school",
    "university": "https://robo.cse.mrt.ac.lk/university",
    "open": "https://robo.cse.mrt.ac.lk/open",
    "contact": "https://robo.cse.mrt.ac.lk/contact",
    "register": "https://robo.cse.mrt.ac.lk/register"
}

extracted = {}

for name, url in urls.items():
    print(f"Processing {name}: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find all RSC chunks
            rsc_chunks = []
            for s in soup.find_all('script'):
                if s.string and 'self.__next_f.push' in s.string:
                    # extract content inside push([1, "..."])
                    matches = re.findall(r'self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)', s.string, re.DOTALL)
                    for m in matches:
                        # decode escaped characters
                        try:
                            # unescape string literal
                            un = m.encode('utf-8').decode('unicode_escape')
                            rsc_chunks.append(un)
                        except Exception:
                            rsc_chunks.append(m)
            
            full_rsc = "\n".join(rsc_chunks)
            
            # Look for FAQs
            faqs = []
            for q_match in re.finditer(r'\{"question":"(.*?)","answer":"(.*?)"\}', full_rsc):
                faqs.append({
                    "question": q_match.group(1),
                    "answer": q_match.group(2)
                })
            
            # Look for phases / timeline
            phases = []
            for p_match in re.finditer(r'\{"tag":"(.*?)","title":"(.*?)","subtitle":"(.*?)"', full_rsc):
                phases.append({
                    "tag": p_match.group(1),
                    "title": p_match.group(2),
                    "subtitle": p_match.group(3)
                })

            extracted[name] = {
                "faqs": faqs,
                "phases": phases,
                "rsc_sample": full_rsc[:2000]
            }
    except Exception as e:
        print(f"Error {name}: {e}")

with open(r"C:\Users\sithu\.gemini\antigravity-ide\brain\778c1229-8e3c-4cc2-8f3d-2b507dc8194b\scratch\extracted_rsc.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)

print("Saved RSC extraction.")
