/* ==========================================================
   plan.js - Pantalla del plan de acción (selector de problemas)
   ========================================================== */
(function (CV) {
  "use strict";
  const { $, mostrar } = CV.ui;
  const E = CV.estado, C = CV.config;

  /* Factores detectados, de mayor a menor puntaje (lo más urgente primero) */
  function factores() {
    return Object.keys(E.ficha).sort((a, b) => C.PUNTOS[b] - C.PUNTOS[a]);
  }

  /* ¿Ya se resolvieron todos los problemas? */
  function todoResuelto() {
    const f = factores();
    return f.length > 0 && f.every(x => E.hechas.has(x));
  }

  /* Crea la tarjeta de un problema (pendiente o resuelto) */
  function crearItem(f) {
    const p = C.PROBLEMAS[f];
    const resuelto = E.hechas.has(f);
    const li = document.createElement("li");
    li.className = "problema" + (resuelto ? " resuelto" : "");
    li.innerHTML =
      `<div class="problema-fila">
         <span class="p-ico" aria-hidden="true">${resuelto ? "✅" : "⚠️"}</span>
         <span class="p-texto">${p.texto}</span>
         ${resuelto
           ? '<span class="chip-ok">Solucionado</span>'
           : '<button class="btn-mini" type="button" aria-expanded="false">Solucionar ahora</button>'}
       </div>`;
    if (resuelto) return li;

    const boton = li.querySelector(".btn-mini");
    if (p.destino === "operador") {
      // PIN débil: al pulsar se despliega la lista de operadores
      boton.addEventListener("click", () => alternarOperadores(li, boton));
    } else {
      // Resto de problemas: va directo al tutorial
      boton.addEventListener("click", () => CV.tutorial.abrir({ factor: f, id: p.tutorial }));
    }
    return li;
  }

  /* Muestra u oculta la lista pequeña de operadores dentro del problema */
  function alternarOperadores(li, boton) {
    const abierto = li.querySelector(".p-operadores");
    if (abierto) { abierto.remove(); boton.setAttribute("aria-expanded", "false"); return; }

    const caja = document.createElement("div");
    caja.className = "p-operadores";
    caja.innerHTML = "<p>Elige tu operador:</p><div class='ops'>" +
      Object.keys(C.OPERADORES).map(n => `<button class="op" type="button" data-op="${n}"><i>${n[0]}</i>${n}</button>`).join("") +
      "</div>";
    caja.querySelectorAll(".op").forEach(b =>
      b.addEventListener("click", () => CV.tutorial.abrir({ factor: "pin", operador: b.dataset.op })));
    li.appendChild(caja);
    boton.setAttribute("aria-expanded", "true");
  }

  /* Redibuja la lista, el riesgo actual y el mensaje de éxito */
  function refrescar(animar) {
    const lista = $("lista");
    lista.innerHTML = "";
    const fs = factores();

    if (!fs.length) {
      lista.innerHTML = '<li class="problema resuelto"><div class="problema-fila"><span class="p-ico">✅</span><span class="p-texto">No encontramos problemas. ¡Buen trabajo!</span></div></li>';
    } else {
      fs.forEach(f => lista.appendChild(crearItem(f)));
    }

    const valor = E.riesgoActual();
    CV.riesgo.aplicarNivel(valor);
    $("planMaximo").textContent = C.MAXIMO;
    $("planMedidor").style.width = (valor / C.MAXIMO * 100) + "%";
    if (animar) CV.riesgo.animarNumero($("planNumero"), valor, 900);   // El número baja a la vista
    else $("planNumero").textContent = valor;

    const listo = todoResuelto();
    $("bannerOk").hidden = !listo;
    $("tituloPlan").textContent = fs.length ? "Tu plan de acción" : "Todo en orden";
    $("subPlan").textContent = !fs.length ? "Sigue así y repite este test cada mes."
      : listo ? "Completaste todos los pasos."
      : "Pulsa “Solucionar ahora” en cada punto. Tu riesgo baja al completar cada paso.";
  }

  /* Abre la pantalla del plan (desde el resultado o al volver de un tutorial) */
  function abrir() {
    const primera = !E.planVisto;
    E.planVisto = true;
    $("app").classList.remove("pulso");     // El borde pulsante es solo de la pantalla de resultado
    refrescar(!primera);
    mostrar("plan");
  }

  CV.plan = { abrir: abrir, todoResuelto: todoResuelto };
})(window.CV = window.CV || {});
