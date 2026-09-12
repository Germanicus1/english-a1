// Flashcards — recuperación activa. Ves español, dices el inglés en voz alta, giras, marcas si lo sabías.
// Las que fallas vuelven a la cola hasta que las aciertas dos veces (Leitner mínimo).
// Uso: Flashcards.render(el, [{ front:"Encantado", back:"Nice to meet you." }])
window.Flashcards = (function () {
  function render(root, cards) {
    root.classList.add("fc");
    let queue = cards.map(c => ({ ...c, hits: 0 }));
    let cur = null, flipped = false, done = 0, total = cards.length;
    const face = document.createElement("div"); face.className = "face";
    const controls = document.createElement("div"); controls.className = "controls";
    const prog = document.createElement("div"); prog.className = "progress";
    const flipBtn = mk("Girar", () => flip(), "primary");
    const sayBtn = mk("Escuchar", () => window.Speak && Speak.say(cur.back));
    const yes = mk("✓ Lo sabía", () => grade(true));
    const no = mk("✗ No lo sabía", () => grade(false));
    controls.append(flipBtn, sayBtn, yes, no);
    root.append(face, controls, prog);
    function mk(label, fn, cls) { const b = document.createElement("button"); b.type = "button"; b.textContent = label; if (cls) b.className = cls; b.onclick = fn; return b; }
    function next() {
      if (!queue.length) { face.textContent = "Hecho. " + total + " tarjetas. Repite mañana antes de la lección nueva."; face.classList.remove("back"); controls.style.display = "none"; prog.textContent = ""; return; }
      cur = queue.shift(); flipped = false;
      face.textContent = cur.front; face.classList.remove("back");
      sayBtn.style.display = yes.style.display = no.style.display = "none"; flipBtn.style.display = "";
      prog.textContent = done + " / " + total + " aprendidas · " + (queue.length + 1) + " en cola";
    }
    function flip() {
      flipped = true; face.textContent = cur.back; face.classList.add("back");
      if (window.Speak) Speak.say(cur.back);
      flipBtn.style.display = "none"; sayBtn.style.display = yes.style.display = no.style.display = "";
    }
    function grade(ok) {
      if (ok) { cur.hits++; if (cur.hits >= 2) done++; else queue.push(cur); }
      else { cur.hits = 0; queue.splice(Math.min(2, queue.length), 0, cur); }
      next();
    }
    next();
  }
  return { render };
})();
