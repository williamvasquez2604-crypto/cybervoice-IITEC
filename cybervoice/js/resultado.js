/* ==========================================================
   resultado.js - Pantalla de resultado (limpia)
   Muestra puntaje, nivel y UN solo botón hacia el plan de acción
   ========================================================== */
(function (CV) {
  "use strict";
  const { $, mostrar } = CV.ui;
  const E = CV.estado, C = CV.config;

  /* Calcula el diagnóstico y dibuja el resultado con su animación */
  function mostrarResultado() {
    const valor = E.riesgoActual();
    const nivel = CV.riesgo.aplicarNivel(valor);

    $("maximo").textContent = C.MAXIMO;
    $("numero").textContent = "0";
    $("anillo").style.strokeDashoffset = 264;           // Anillo vacío antes de animar
    $("nivel").textContent = nivel.titulo;
    $("etiqueta").textContent = "Nivel: " + nivel.etiqueta;
    $("mensaje").textContent = nivel.mensaje;

    const aSalvo = valor <= C.UMBRAL_SEGURO;
    $("icono").innerHTML = aSalvo ? C.ICONOS.escudo : C.ICONOS.alerta;
    $("icono").className = "icono-nivel " + (aSalvo ? "brilla" : "alerta");

    mostrar("resultado");
    void $("anillo").getBoundingClientRect();           // Fuerza el repintado para que la transición se vea
    $("anillo").style.strokeDashoffset = 264 - 264 * valor / C.MAXIMO;
    CV.riesgo.animarNumero($("numero"), valor, 1300);

    // Animación según el nivel: borde rojo pulsante si hay riesgo, confeti verde si está a salvo
    $("app").classList.toggle("pulso", !aSalvo);
    if (aSalvo) CV.efectos.confeti();
  }

  CV.resultado = { mostrar: mostrarResultado };
})(window.CV = window.CV || {});
