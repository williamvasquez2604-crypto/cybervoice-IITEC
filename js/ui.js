/* ==========================================================
   ui.js - Utilidades de interfaz reutilizables
   ========================================================== */
(function (CV) {
  "use strict";

  /* Atajo para buscar elementos por su id */
  const $ = id => document.getElementById(id);

  /* Muestra una pantalla, oculta las demás y mueve el foco para lectores de pantalla */
  function mostrar(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("on"));
    const pantalla = $(id);
    void pantalla.offsetWidth;                       // Reinicia la animación de entrada
    pantalla.classList.add("on");
    pantalla.setAttribute("tabindex", "-1");
    pantalla.focus({ preventScroll: true });
  }

  /* Muestra el spinner un momento y luego ejecuta una acción */
  function cargar(texto, ms, despues) {
    CV.estado.bloqueado = true;
    $("textoCarga").textContent = texto;
    $("carga").classList.add("on");
    setTimeout(() => {
      despues();
      $("carga").classList.remove("on");
      CV.estado.bloqueado = false;
    }, ms);
  }

  CV.ui = { $: $, mostrar: mostrar, cargar: cargar };
})(window.CV = window.CV || {});
