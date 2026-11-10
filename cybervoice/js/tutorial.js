/* ==========================================================
   tutorial.js - Pantalla de tutorial guiado con dos opciones
   ========================================================== */
(function (CV) {
  "use strict";
  const { $, mostrar } = CV.ui;
  const E = CV.estado, C = CV.config;
  let definicion = null;   // Tutorial que se está mostrando

  /* Dibuja los pasos de la opción elegida y marca su pestaña */
  function seleccionar(indice) {
    document.querySelectorAll("#tabs .tab").forEach((t, i) => {
      t.setAttribute("aria-selected", i === indice);
      t.tabIndex = i === indice ? 0 : -1;
    });
    $("tutPasos").innerHTML = '<ol class="pasos">' +
      definicion.opciones[indice].pasos.map(p => `<li class="paso"><span>${p}</span></li>`).join("") + "</ol>";
  }

  /* Abre el tutorial. ctx = { factor, id } o { factor, operador } */
  function abrir(ctx) {
    E.tutorial = ctx;
    definicion = ctx.operador ? C.tutorialOperador(ctx.operador) : C.TUTORIALES[ctx.id];

    $("tutTitulo").textContent = definicion.titulo;
    $("tutSub").textContent = definicion.sub;
    $("tutNota").textContent = C.NOTA_MENU;

    // Pestañas: Opción A y Opción B como botones grandes
    $("tabs").innerHTML = definicion.opciones.map((o, i) =>
      `<button class="tab" type="button" role="tab" aria-selected="false"><small>Opción ${"AB"[i]}</small>${o.etiqueta}</button>`).join("");
    document.querySelectorAll("#tabs .tab").forEach((t, i) => t.addEventListener("click", () => seleccionar(i)));

    seleccionar(0);
    mostrar("tutorial");
  }

  /* Cambia de pestaña con las flechas del teclado */
  function teclasPestañas(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = [...document.querySelectorAll("#tabs .tab")];
    const actual = tabs.findIndex(t => t.getAttribute("aria-selected") === "true");
    const nuevo = (actual + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    seleccionar(nuevo);
    tabs[nuevo].focus();
  }

  /* "He completado este paso": resta los puntos, vuelve al plan y marca el problema */
  function completar() {
    if (!E.tutorial) return;
    const factor = E.tutorial.factor;
    E.hechas.add(factor);                                    // El riesgo baja los puntos de este factor
    E.tutorial = null;
    CV.plan.abrir();                                         // Vuelve al plan (con ✅ y número animado)
    if (CV.plan.todoResuelto()) CV.efectos.felicitar();      // Todo resuelto: confeti y felicitación
    else CV.efectos.aviso("−" + C.PUNTOS[factor] + " puntos · ¡Buen trabajo!");
  }

  CV.tutorial = { abrir: abrir, completar: completar, teclas: teclasPestañas };
})(window.CV = window.CV || {});
