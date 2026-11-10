/* ==========================================================
   riesgo.js - Utilidades compartidas por resultado, plan y tutorial
   ========================================================== */
(function (CV) {
  "use strict";
  const $ = CV.ui.$, E = CV.estado;

  /* Anima un número desde el que se ve ahora hasta el valor nuevo */
  function animarNumero(el, destino, duracion) {
    cancelAnimationFrame(el._raf || 0);
    const desde = parseInt(el.textContent, 10) || 0, t0 = performance.now(), dur = duracion || 800;
    (function paso(t) {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(desde + (destino - desde) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) el._raf = requestAnimationFrame(paso);
    })(t0);
  }

  /* Pone el color de nivel en toda la app (--c) y devuelve el nivel */
  function aplicarNivel(valor) {
    const nivel = E.nivel(valor), app = $("app");
    app.classList.remove("medio", "critico");
    if (nivel.clase) app.classList.add(nivel.clase);
    return nivel;
  }

  CV.riesgo = { animarNumero: animarNumero, aplicarNivel: aplicarNivel };
})(window.CV = window.CV || {});
