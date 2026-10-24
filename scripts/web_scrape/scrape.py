import urllib.request
import ssl
from bs4 import BeautifulSoup
import json
import re
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_url = "https://robo.cse.mrt.ac.lk"
visited = set()
to_visit = ["/", "/school", "/university", "/open", "/contact"]
results = {}

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

while to_visit:
    path = to_visit.pop(0)
    if path in visited:
        continue
    visited.add(path)
    
    url = base_url + path if path.startswith('/') else path
    print(f"Fetching: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            content_type = resp.headers.get('content-type', '')
            if 'text/html' not in content_type:
                continue
            html = resp.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find more internal links
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.startswith('/') and not href.startswith('//') and not href.startswith('/#') and not href.startswith('/_next'):
                    # clean path
                    clean_p = href.split('#')[0].split('?')[0]
                    if clean_p and clean_p not in visited and clean_p not in to_visit:
                        to_visit.append(clean_p)
            
            # Extract title & description
            title = soup.title.string if soup.title else ""
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            desc = meta_desc['content'] if meta_desc and 'content' in meta_desc.attrs else ""
            
            # Remove scripts, styles, svgs
            for s in soup(['script', 'style', 'svg', 'noscript']):
                s.decompose()
            
            # Extract structured sections
            sections = []
            for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote', 'table']):
                t = clean_text(tag.get_text())
                if t:
                    sections.append({'tag': tag.name, 'text': t})
                    
            links = []
            for a in soup.find_all('a', href=True):
                t = clean_text(a.get_text())
                href = a['href']
                links.append({'text': t, 'href': href})

            results[path] = {
                'url': url,
                'title': title,
                'description': desc,
                'sections': sections,
                'links': links
            }
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        results[path] = {'error': str(e)}

out_dir = r"C:\Users\sithu\.gemini\antigravity-ide\brain\778c1229-8e3c-4cc2-8f3d-2b507dc8194b\scratch"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "scraped_data.json")

with open(out_file, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Scraped {len(results)} pages successfully. Output saved to {out_file}")
