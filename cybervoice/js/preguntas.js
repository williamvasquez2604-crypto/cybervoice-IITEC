/* ==========================================================
   preguntas.js - Flujo del test: dibujar, validar, puntuar y avanzar
   ========================================================== */
(function (CV) {
  "use strict";
  const { $, cargar } = CV.ui;
  const E = CV.estado, C = CV.config, V = CV.validacion;

  /* Dibuja la pregunta actual y muestra el tipo de respuesta que le corresponde */
  function pintar() {
    const q = C.PREGUNTAS[E.paso];
    $("contador").textContent = "Pregunta " + (E.paso + 1) + " de " + C.PREGUNTAS.length;
    $("barra").style.width = (E.paso / C.PREGUNTAS.length * 100) + "%";
    $("pregunta").textContent = q.t;
    $("ayuda").textContent = q.a;
    $("ayuda").style.display = q.a ? "block" : "none";
    document.querySelectorAll(".zona").forEach(z => z.classList.toggle("on", z.id === q.z));

    // Las preguntas Sí/No avanzan solas; las demás usan el botón Continuar
    $("continuar").style.display = q.tipo === "sino" ? "none" : "block";
    $("continuar").disabled = q.tipo === "cards" && !E.noche;

    // Limpia la selección de los botones Sí/No al pasar a otra pregunta
    document.querySelectorAll(".gran").forEach(b => { b.classList.remove("sel"); b.setAttribute("aria-pressed", "false"); });
    if (q.tipo === "pin") setTimeout(() => $("pin").focus(), 80);
  }

  /* Pasa a la siguiente pregunta o, si ya no hay más, al análisis final */
  function avanzar() {
    E.paso++;
    $("barra").style.width = (E.paso / C.PREGUNTAS.length * 100) + "%";
    if (E.paso < C.PREGUNTAS.length) cargar("Guardando respuesta…", 700, pintar);
    else cargar("Analizando tus respuestas…", 1800, CV.resultado.mostrar);
  }

  /* Procesa las preguntas con botón Continuar: PIN, interruptor y tarjetas */
  function continuar() {
    if (E.bloqueado) return;
    const q = C.PREGUNTAS[E.paso];

    if (q.tipo === "pin") {
      const r = V.validar($("pin").value);
      if (!r.ok) { V.mostrarError(r.mensaje); $("pin").focus(); return; }   // Entrada inválida: no avanza
      if (r.debil) E.ficha.pin = true;                                       // PIN débil o "no se": +40
      $("pin").value = "";                                                   // No se conserva el PIN escrito
      V.mostrarError("");
    } else if (q.tipo === "switch") {
      if (!E.dosPasos) E.ficha.dos_pasos = true;                             // Apagado: +30
    } else if (q.tipo === "cards") {
      if (!E.noche) return;
      if (E.noche === "avion" || E.noche === "ambos") E.ficha.noche = true;  // Avión o ambos: +15
    }
    avanzar();
  }

  /* Procesa las preguntas Sí/No: marca el factor solo si la respuesta es la riesgosa */
  function responderSiNo(boton) {
    if (E.bloqueado) return;
    const q = C.PREGUNTAS[E.paso];
    document.querySelectorAll(".gran").forEach(b => {
      b.classList.toggle("sel", b === boton);
      b.setAttribute("aria-pressed", b === boton);
    });
    if (boton.dataset.r === q.riesgo) E.ficha[q.factor] = true;
    E.bloqueado = true;
    setTimeout(() => { E.bloqueado = false; avanzar(); }, 450);   // Pausa corta para ver el color elegido
  }

  CV.preguntas = { pintar: pintar, continuar: continuar, responderSiNo: responderSiNo };
})(window.CV = window.CV || {});
