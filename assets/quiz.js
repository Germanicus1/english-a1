// Quiz — opción múltiple con feedback inmediato. Baraja las opciones.
// Uso: Quiz.render(document.querySelector("#quiz1"), [{ q, options:[...], answer:0, explain, say }])
// Regla del curso: todas las opciones con el mismo número de palabras — sin pistas de formato.
window.Quiz = (function () {
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function render(root, questions) {
    root.classList.add("quiz");
    let answered = 0, correct = 0;
    const score = document.createElement("div"); score.className = "score";
    questions.forEach((item, idx) => {
      const q = document.createElement("div"); q.className = "q";
      const t = document.createElement("div"); t.className = "q-text"; t.textContent = (idx + 1) + ". " + item.q; q.appendChild(t);
      const opts = document.createElement("div"); opts.className = "opts";
      const order = shuffle(item.options.map((o, i) => ({ o, i })));
      order.forEach(({ o, i }) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.textContent = o;
        b.onclick = () => {
          if (q.classList.contains("done")) return;
          q.classList.add("done"); answered++;
          const right = i === item.answer;
          if (right) correct++;
          b.classList.add(right ? "correct" : "wrong");
          opts.querySelectorAll(".opt").forEach((ob, k) => { if (order[k].i === item.answer) ob.classList.add("correct"); ob.disabled = true; });
          if (window.Speak && item.say !== false) Speak.say(item.options[item.answer]);
          if (answered === questions.length) {
            score.style.display = "block";
            score.innerHTML = "<strong>" + correct + " / " + questions.length + "</strong> — " +
              (correct === questions.length ? "Perfecto. Mañana lo repasamos sin mirar." :
               correct >= questions.length * 0.7 ? "Bien. Relee las que fallaste y vuelve a hacer el quiz mañana." :
               "Normal el primer día. Vuelve a la tabla de frases, léelas en voz alta y repite el quiz.");
          }
        };
        opts.appendChild(b);
      });
      q.appendChild(opts);
      const ex = document.createElement("div"); ex.className = "explain"; ex.textContent = item.explain || ""; q.appendChild(ex);
      root.appendChild(q);
    });
    root.appendChild(score);
  }
  return { render };
})();
