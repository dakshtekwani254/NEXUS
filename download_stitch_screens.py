import json
import os
import urllib.request

with open(r'c:\Users\Daksh\Desktop\AzinHack_26\scratch_screens.json', 'r', encoding='utf-8') as f:
    screens = json.load(f)

out_dir = r'c:\Users\Daksh\Desktop\AzinHack_26\stitch_screens'
os.makedirs(out_dir, exist_ok=True)

print(f"Downloading {len(screens)} screens...")
for s in screens:
    sid = s['id']
    title = s['title'].replace('NEXUS — ', '').replace('/', '-').strip()
    # clean filename
    safe_name = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
    if not safe_name:
        safe_name = sid
    filename = f"{s['index']:02d}_{safe_name}.html"
    filepath = os.path.join(out_dir, filename)
    
    url = s.get('html_url')
    if url:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read()
                with open(filepath, 'wb') as f_out:
                    f_out.write(content)
            print(f"Saved: {filename} ({len(content)} bytes)")
        except Exception as e:
            print(f"Failed to download {filename} from {url}: {e}")
    else:
        print(f"No HTML URL for {filename}")

print("Done downloading screens!")
