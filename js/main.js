/* ==========================================================
   main.js - Punto de entrada: conecta los eventos de la interfaz
   ========================================================== */
(function (CV) {
  "use strict";
  const { $, mostrar, cargar } = CV.ui;
  const E = CV.estado, V = CV.validacion;

  /* Inicio del test */
  $("empezar").addEventListener("click", () =>
    cargar("Preparando el test…", 600, () => { CV.preguntas.pintar(); mostrar("test"); }));

  /* Botón Continuar y tecla Enter dentro del campo del PIN */
  $("continuar").addEventListener("click", CV.preguntas.continuar);
  $("pin").addEventListener("keydown", e => { if (e.key === "Enter") CV.preguntas.continuar(); });

  /* Validación en vivo: error si lo escrito ya no puede ser un número ni "no se" */
  $("pin").addEventListener("input", () => {
    const v = V.limpiar($("pin").value);
    V.mostrarError(V.esPrefijoValido(v) ? "" : CV.config.MSG_PIN);
  });

  /* Ojo: alterna entre mostrar y ocultar el PIN */
  $("ojo").addEventListener("click", () => {
    const ver = $("pin").type === "password";
    $("pin").type = ver ? "text" : "password";
    $("ojo").classList.toggle("ver", ver);
    $("ojo").setAttribute("aria-label", ver ? "Ocultar PIN" : "Mostrar PIN");
  });

  /* Interruptor de la verificación en dos pasos */
  $("interruptor").addEventListener("click", () => {
    E.dosPasos = !E.dosPasos;
    $("interruptor").setAttribute("aria-checked", E.dosPasos);
    $("estado").textContent = E.dosPasos ? "Sí, está activada" : "No, está apagada";
    $("estado").classList.toggle("on", E.dosPasos);
  });

  /* Tarjetas de la P3: al elegir una se habilita Continuar */
  document.querySelectorAll('input[name="noche"]').forEach(r =>
    r.addEventListener("change", () => { E.noche = r.value; $("continuar").disabled = false; }));

  /* Botones Sí/No de las preguntas 4, 5 y 6 */
  document.querySelectorAll(".gran").forEach(b =>
    b.addEventListener("click", () => CV.preguntas.responderSiNo(b)));

  /* Navegación entre pantallas: resultado -> plan -> tutorial -> plan */
  $("verPlan").addEventListener("click", CV.plan.abrir);              // Botón único del resultado
  $("atras").addEventListener("click", CV.plan.abrir);                // Volver al plan sin completar
  $("completar").addEventListener("click", CV.tutorial.completar);    // "He completado este paso"
  $("tabs").addEventListener("keydown", CV.tutorial.teclas);          // Flechas para cambiar de opción

  /* Reinicio: recarga la aplicación desde cero */
  $("reiniciar").addEventListener("click", () => location.reload());
})(window.CV = window.CV || {});
