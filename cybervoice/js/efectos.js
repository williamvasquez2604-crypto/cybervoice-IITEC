/* ==========================================================
   efectos.js - Gamificación visual: confeti y avisos flotantes
   ========================================================== */
(function (CV) {
  "use strict";
  const $ = CV.ui.$;
  let temporizador = 0;

  /* Crea 70 partículas verdes que caen por la pantalla */
  function confeti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;   // Respeta la accesibilidad
    const caja = document.createElement("div");
    caja.className = "confeti";
    caja.setAttribute("aria-hidden", "true");
    const colores = ["#25d366", "#128c7e", "#5cf09a", "#b9f6ca", "#ffffff"];
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "vw";
      s.style.background = colores[i % colores.length];
      s.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");      // Desvío lateral
      s.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");   // Giro
      s.style.animationDuration = (2.6 + Math.random() * 2) + "s";
      s.style.animationDelay = (Math.random() * 0.9) + "s";
      caja.appendChild(s);
    }
    document.body.appendChild(caja);
    setTimeout(() => caja.remove(), 6000);                                  // Limpieza
  }

  /* Aviso flotante verde que se oculta solo */
  function aviso(texto, ms) {
    const t = $("toast");
    t.textContent = texto;
    t.classList.add("on");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => t.classList.remove("on"), ms || 3500);
  }

  /* Felicitación final: aviso largo + confeti */
  function felicitar() {
    aviso("✔ ¡Felicidades! Has blindado tu cuenta por completo", 5500);
    confeti();
  }

  CV.efectos = { confeti: confeti, aviso: aviso, felicitar: felicitar };
})(window.CV = window.CV || {});
