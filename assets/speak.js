// Speak — voz británica femenina (Web Speech API), selector de voz persistente y reconocimiento
// opcional para comprobar pronunciación.
// Uso:  Speak.say("Nice to meet you")
//       <span data-say="Nice to meet you">…</span>  → añade botón ▶ automáticamente
//       Speak.listen(expectedText, (result) => …)  → { heard, ok }
//       <div data-voice-picker></div>                → selector de voz (se guarda en localStorage)
window.Speak = (function () {
  const KEY = "course-voice";
  let voice = null;
  // Calidad conocida, de mejor a peor. Las voces "novedad" de macOS (Flo, Shelley, Sandy, Grandma…) suenan rotas: al final.
  const ranked = [
    /Google UK English Female/i,
    /en[-_]GB.*(Kate|Serena|Martha|Stephanie)/i,   // macOS mejoradas (si se descargan)
    /en[-_]GB.*(Libby|Sonia|Hazel|Susan|Mia)/i,   // Windows/Edge
    /en[-_]GB.*(Fiona|Moira|Tessa|Karen)/i,       // otras Apple (IE/ZA/AU) — femeninas
    /Google UK English Male/i,
    /en[-_]GB.*Daniel/i,                          // masculina pero de calidad: mejor que una femenina rota
    /en[-_]GB.*(Flo|Shelley|Sandy|Grandma)/i,
    /en[-_]GB/i, /^en/i,
  ];
  function voices() { return ("speechSynthesis" in window) ? speechSynthesis.getVoices() : []; }
  function pickVoice() {
    const vs = voices(); if (!vs.length) return null;
    let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) { const v = vs.find(v => v.name === saved); if (v) return v; }
    for (const r of ranked) { const v = vs.find(v => r.test(v.lang + " " + v.name)); if (v) return v; }
    return null;
  }
  function refresh() { voice = pickVoice(); renderPickers(); }
  if ("speechSynthesis" in window) { refresh(); speechSynthesis.onvoiceschanged = refresh; }

  function say(text, rate) {
    if (!("speechSynthesis" in window)) return alert("Tu navegador no tiene voz. Usa Chrome.");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB"; u.rate = rate || 0.85;
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  function setVoice(name) { try { localStorage.setItem(KEY, name); } catch (e) {} refresh(); }

  function renderPickers() {
    document.querySelectorAll("[data-voice-picker]").forEach(el => {
      const vs = voices().filter(v => /^en/i.test(v.lang));
      if (!vs.length) { el.textContent = "Sin voces en inglés disponibles."; return; }
      const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
      const hasGoogle = vs.some(v => /Google UK English Female/.test(v.name));
      el.innerHTML = '<label style="font-family:var(--sans);font-size:.85rem;color:var(--muted)">Voz: <select></select></label>' +
        (hasGoogle ? "" : '<div class="sidenote" style="position:static;width:auto;margin:.5rem 0 0">' +
          (isChrome ? 'La voz "Google UK English Female" no aparece: comprueba la conexión a internet.'
                    : 'Para una voz femenina británica de calidad abre esta lección en <strong>Google Chrome</strong> (voz "Google UK English Female").') + '</div>');
      const sel = el.querySelector("select");
      vs.sort((a, b) => ranked.findIndex(r => r.test(a.lang + " " + a.name)) - ranked.findIndex(r => r.test(b.lang + " " + b.name)))
        .forEach(v => { const o = document.createElement("option"); o.value = v.name; o.textContent = v.name + " (" + v.lang + ")"; if (voice && v.name === voice.name) o.selected = true; sel.appendChild(o); });
      sel.onchange = () => { setVoice(sel.value); say("Hi, I'm your English teacher. Nice to meet you."); };
    });
  }

  function normalise(s) { return s.toLowerCase().replace(/[^a-z' ]/g, "").replace(/\s+/g, " ").trim(); }
  function listen(expected, cb) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return cb({ heard: null, ok: null, unsupported: true });
    const r = new SR(); r.lang = "en-GB"; r.interimResults = false; r.maxAlternatives = 3;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0]).map(a => normalise(a.transcript));
      cb({ heard: alts[0], ok: alts.some(a => a === normalise(expected)) });
    };
    r.onerror = (e) => cb({ heard: null, ok: null, error: e.error });
    r.start();
  }
  function enhance(root) {
    (root || document).querySelectorAll("[data-say]").forEach(el => {
      if (el.dataset.enhanced) return; el.dataset.enhanced = "1";
      const b = document.createElement("button"); b.className = "say"; b.type = "button"; b.title = "Escuchar";
      b.textContent = "escuchar"; b.onclick = () => say(el.dataset.say || el.textContent);
      el.after(b);
    });
  }
  document.addEventListener("DOMContentLoaded", () => { enhance(); renderPickers(); });
  return { say, listen, enhance, setVoice };
})();
