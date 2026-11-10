/* ==========================================================
   validacion.js - Reglas del PIN (Pregunta 1)
   ========================================================== */
(function (CV) {
  "use strict";

  /* Limpia el texto: sin espacios sobrantes, en minúsculas y "sé" -> "se" */
  function limpiar(texto) {
    return texto.trim().toLowerCase().replace(/é/g, "e").replace(/\s+/g, " ");
  }

  /* ¿Lo escrito hasta ahora PUEDE llegar a ser válido?
     Solo números, o el comienzo de "no se" (así no marca error mientras escribe "no s") */
  function esPrefijoValido(v) {
    return /^\d*$/.test(v) || "no se".startsWith(v);
  }

  /* Valida el PIN completo. Devuelve { ok, debil, mensaje } */
  function validar(texto) {
    const C = CV.config;
    const v = limpiar(texto);
    if (!v) return { ok: false, mensaje: C.MSG_PIN_VACIO };
    if (/^\d{1,6}$/.test(v)) return { ok: true, debil: C.PINS_DEBILES.includes(v) };   // Solo números, máx. 6
    if (v === "no se") return { ok: true, debil: true };                                // "No sé" cuenta como débil
    return { ok: false, mensaje: C.MSG_PIN };                                           // Letras no permitidas
  }

  /* Muestra o quita el error rojo suave debajo del input */
  function mostrarError(mensaje) {
    document.getElementById("error").textContent = mensaje;
    document.getElementById("pin").classList.toggle("invalido", mensaje !== "");
  }

  CV.validacion = { limpiar: limpiar, esPrefijoValido: esPrefijoValido, validar: validar, mostrarError: mostrarError };
})(window.CV = window.CV || {});
