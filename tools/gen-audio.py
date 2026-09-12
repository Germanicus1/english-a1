#!/usr/bin/env python3
"""Pre-genera audio mp3 (voz neuronal británica femenina) para cada frase del curso.

Extrae de lessons/*.html y reference/*.html:
  - data-say="…"
  - back: "…"            (flashcards)
  - options: ["…", …]    (quiz)
Escribe assets/audio/<sha1>.mp3 y assets/audio/manifest.json {texto: archivo}.
speak.js reproduce el mp3 si existe; si no, cae a la voz del navegador.

Uso:  <venv>/bin/python tools/gen-audio.py          (requiere: pip install edge-tts)
"""
import asyncio, hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "audio"
VOICE, RATE = "en-GB-SoniaNeural", "-15%"

def norm(t): return re.sub(r"\s+", " ", t).strip()
def key(t): return hashlib.sha1(norm(t).lower().encode()).hexdigest()[:12]

def extract():
    texts = set()
    for f in list((ROOT / "lessons").glob("*.html")) + list((ROOT / "reference").glob("*.html")):
        s = f.read_text()
        texts |= {norm(m) for m in re.findall(r'data-say="([^"]+)"', s)}
        texts |= {norm(m) for m in re.findall(r'back:\s*"([^"]+)"', s)}
        for arr in re.findall(r'options:\s*\[([^\]]+)\]', s):
            texts |= {norm(m) for m in re.findall(r'"((?:[^"\\]|\\.)*)"', arr)}
    return sorted(t.replace('\\"', '"').replace("\\'", "'") for t in texts if t)

async def main():
    import edge_tts
    OUT.mkdir(parents=True, exist_ok=True)
    mpath = OUT / "manifest.json"
    manifest = json.loads(mpath.read_text()) if mpath.exists() else {}
    texts = extract(); new = 0
    for t in texts:
        fn = key(t) + ".mp3"
        if (OUT / fn).exists(): manifest[t] = fn; continue
        await edge_tts.Communicate(t, VOICE, rate=RATE).save(str(OUT / fn))
        manifest[t] = fn; new += 1
        print("+", t)
    mpath.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True))
    print(f"{len(texts)} frases, {new} nuevas → {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    asyncio.run(main())
