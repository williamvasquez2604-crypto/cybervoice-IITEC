/* ==========================================================
   estado.js - Estado compartido y cálculo del nivel de riesgo
   ========================================================== */
(function (CV) {
  "use strict";

  CV.estado = {
    paso: 0,              // Pregunta actual (0 a 5)
    ficha: {},            // Factores de riesgo detectados, ej. { pin: true }
    hechas: new Set(),    // Factores ya resueltos con los tutoriales
    dosPasos: false,      // Estado del interruptor (P2)
    noche: null,          // Opción elegida en las tarjetas (P3)
    bloqueado: false,     // Evita clics dobles durante las cargas
    tutorial: null,       // Tutorial abierto: { factor, id, operador }
    planVisto: false,     // ¿Ya se abrió el plan alguna vez? (para animar solo después)

    /* Riesgo actual: suma los factores detectados que aún no se resolvieron */
    riesgoActual() {
      const P = CV.config.PUNTOS;
      return Object.keys(this.ficha)
        .filter(f => !this.hechas.has(f))
        .reduce((suma, f) => suma + P[f], 0);
    },

    /* Devuelve el nivel (título, color, etiqueta y mensaje) que corresponde a un puntaje */
    nivel(valor) {
      return CV.config.NIVELES.find(n => valor <= n.hasta);
    }
  };
})(window.CV = window.CV || {});
