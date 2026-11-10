/* ==========================================================
   config.js - Datos y constantes de la aplicación
   Aquí se editan textos, puntajes, operadores y tutoriales SIN tocar la lógica.
   Todos los archivos comparten el espacio de nombres global "CV".
   ========================================================== */
(function (CV) {
  "use strict";

  /* Puntos de riesgo por factor. Es la ÚNICA fuente de puntajes:
     se suman al responder y se restan al completar un tutorial. */
  const PUNTOS = { pin: 40, dos_pasos: 30, codigo: 20, noche: 15, llamadas: 15, dispositivos: 10 };

  /* Código estándar de red para desactivar el buzón (puede variar según operador) */
  const DESACTIVAR = { codigo: "##004#", cancelarDesvios: "##002#" };

  /* ---------- Pasos reutilizables (HTML permitido: <b> y <code>) ---------- */
  const PASOS_DESACTIVAR = [
    "Marca <code>" + DESACTIVAR.codigo + "</code> desde tu celular y pulsa llamar.",
    "Espera el mensaje de confirmación de la red.",
    "Listo: tus llamadas ya no se desviarán al buzón. Si no funciona, llama a tu operador y pide “desactivar el buzón de voz”."
  ];
  const PASOS_2FA = [
    "Abre WhatsApp y entra a <b>Ajustes</b> (en Android: ⋮ y luego Ajustes; en iPhone: pestaña Configuración).",
    "Toca <b>Cuenta</b>.",
    "Toca <b>Verificación en dos pasos</b> › <b>Activar</b> y crea un PIN de 6 números.",
    "Toca <b>Agregar correo</b> y confírmalo: así podrás recuperar tu cuenta si olvidas el PIN."
  ];
  const PASOS_BLOQUEO_APP = [
    "Abre WhatsApp y entra a <b>Ajustes</b>.",
    "Toca <b>Privacidad</b>.",
    "Baja hasta <b>Bloqueo con huella/rostro</b> y actívalo.",
    "Elige que se bloquee <b>Inmediatamente</b> para que nadie abra tus chats con tu celular desbloqueado."
  ];
  const PASOS_DISPOSITIVOS = [
    "Abre WhatsApp y entra a <b>Ajustes</b>.",
    "Toca <b>Dispositivos vinculados</b>. Verás los aparatos donde tu cuenta está abierta.",
    "Toca cada dispositivo que no reconozcas y elige <b>Cerrar sesión</b>."
  ];

  CV.config = {
    /* PINs considerados débiles (se comparan ya limpios) */
    PINS_DEBILES: ["1234", "0000", "1111", "4444"],

    /* Mensajes de error del PIN */
    MSG_PIN: "Por favor, ingresa un PIN válido (solo números) o escribe 'no se'",
    MSG_PIN_VACIO: "Escribe tu PIN (solo números) o la frase “no se” para continuar.",

    PUNTOS: PUNTOS,
    MAXIMO: Object.values(PUNTOS).reduce((a, b) => a + b, 0),   // = 130
    UMBRAL_SEGURO: 30,

    /* Niveles de riesgo: 0-30 seguro · 31-60 medio · 61+ crítico */
    NIVELES: [
      { hasta: 30, clase: "", etiqueta: "Seguro", titulo: "¡Estás a Salvo!",
        mensaje: "Tus hábitos de seguridad son sólidos. Aun así, repasa tu plan para mantenerte protegido." },
      { hasta: 60, clase: "medio", etiqueta: "Medio", titulo: "Riesgo Medio",
        mensaje: "Tienes algunos puntos débiles. Corregirlos es rápido y te guiamos paso a paso." },
      { hasta: Infinity, clase: "critico", etiqueta: "Crítico", titulo: "Riesgo Crítico",
        mensaje: "Tu buzón y tu cuenta están muy expuestos. Vamos a arreglarlo juntos, paso a paso." }
    ],

    /* Preguntas: "tipo" decide qué respuesta se muestra, "z" qué zona del HTML,
       "factor" el riesgo que suma y "riesgo" qué botón (si/no) lo activa */
    PREGUNTAS: [
      { tipo: "pin",    z: "zPin",    t: "¿Cuál es el PIN de tu buzón? (Si no lo sabes, escribe 'no se')", a: "" },
      { tipo: "switch", z: "zSwitch", t: "¿Tienes la Verificación en dos pasos activada?", a: "Es una clave extra que te pide WhatsApp al entrar." },
      { tipo: "cards",  z: "zCards",  t: "¿Dejas el celular en modo avión/silencio en las noches?", a: "Elige la opción que más se parezca a ti." },
      { tipo: "sino",   z: "zSiNo",   factor: "llamadas",     riesgo: "si", t: "¿Tus llamadas perdidas caen directo al buzón?", a: "" },
      { tipo: "sino",   z: "zSiNo",   factor: "codigo",       riesgo: "si", t: "¿Alguna vez has compartido tu código de verificación de 6 dígitos con alguien por chat o llamada?", a: "" },
      { tipo: "sino",   z: "zSiNo",   factor: "dispositivos", riesgo: "no", t: "¿Sabes cómo revisar los dispositivos vinculados a tu WhatsApp en este momento?", a: "" }
    ],

    /* Problemas que se muestran en el plan de acción.
       destino "operador" = primero se elige operador; "tutorial" = va directo al tutorial indicado */
    PROBLEMAS: {
      pin:          { texto: "Tu buzón de voz usa un PIN débil.", destino: "operador" },
      dos_pasos:    { texto: "No tienes activada la verificación en dos pasos.", destino: "tutorial", tutorial: "whatsapp" },
      codigo:       { texto: "Compartiste tu código de verificación con alguien.", destino: "tutorial", tutorial: "codigo" },
      llamadas:     { texto: "Tus llamadas perdidas caen directo al buzón.", destino: "tutorial", tutorial: "llamadas" },
      noche:        { texto: "Dejas el celular en modo avión por las noches.", destino: "tutorial", tutorial: "noche" },
      dispositivos: { texto: "No sabes revisar los dispositivos vinculados.", destino: "tutorial", tutorial: "dispositivos" }
    },

    /* Pasos USSD para cambiar la clave del buzón, por operador (Perú) */
    OPERADORES: {
      Claro:    { codigo: "*111#", pasos: ["Elige la opción <b>Buzón</b>.", "Selecciona <b>Cambiar Clave</b>."] },
      Movistar: { codigo: "*123#", pasos: ["Entra a <b>Gestión de Buzón</b>.", "Selecciona <b>Cambiar PIN</b>."] },
      Entel:    { codigo: "*123#", pasos: ["Entra a <b>Configuración</b>.", "Elige <b>Buzón de voz</b>."] },
      Bitel:    { codigo: "*123#", pasos: ["Entra a <b>Buzón</b>.", "Selecciona <b>Cambiar contraseña</b>."] }
    },

    /* Tutoriales con DOS opciones cada uno (el del buzón se arma con tutorialOperador) */
    TUTORIALES: {
      whatsapp: {
        titulo: "Configurar WhatsApp", sub: "Elige cómo quieres blindar tu cuenta. Con una opción basta.",
        opciones: [
          { etiqueta: "Activar verificación en dos pasos", pasos: PASOS_2FA },
          { etiqueta: "Poner contraseña a la app", pasos: PASOS_BLOQUEO_APP }
        ]
      },
      codigo: {
        titulo: "Protege tu cuenta de WhatsApp", sub: "Tu código pudo quedar en manos de otra persona. Elige cómo cerrar esa puerta.",
        opciones: [
          { etiqueta: "Revisar dispositivos vinculados", pasos: PASOS_DISPOSITIVOS },
          { etiqueta: "Activar verificación en dos pasos", pasos: PASOS_2FA }
        ]
      },
      dispositivos: {
        titulo: "Revisa tus dispositivos", sub: "Aprende a ver quién usa tu WhatsApp y a cerrar sesiones ajenas.",
        opciones: [
          { etiqueta: "Revisar dispositivos vinculados", pasos: PASOS_DISPOSITIVOS },
          { etiqueta: "Poner contraseña a la app", pasos: PASOS_BLOQUEO_APP }
        ]
      },
      llamadas: {
        titulo: "Protege tus llamadas perdidas", sub: "Evita que las llamadas que no contestas lleguen a un buzón desprotegido.",
        opciones: [
          { etiqueta: "Revisar desvíos de llamadas", pasos: [
              "Marca <code>*#21#</code> y pulsa llamar para ver si hay un desvío activo.",
              "Si aparece un número que no es tuyo, marca <code>" + DESACTIVAR.cancelarDesvios + "</code> para cancelar todos los desvíos.",
              "Espera el mensaje de confirmación de la red." ] },
          { etiqueta: "Desactivar el buzón", pasos: PASOS_DESACTIVAR }
        ]
      },
      noche: {
        titulo: "Duerme sin riesgo", sub: "Con el modo avión, tus llamadas caen al buzón sin que te enteres.",
        opciones: [
          { etiqueta: "Usar “No molestar” en vez de modo avión", pasos: [
              "Abre los ajustes rápidos de tu celular (desliza desde arriba).",
              "Apaga el <b>Modo avión</b>.",
              "Activa <b>No molestar</b> (o Concentración) y prográmalo para tu horario de dormir." ] },
          { etiqueta: "Desactivar el buzón", pasos: PASOS_DESACTIVAR }
        ]
      }
    },

    /* Arma el tutorial del buzón para el operador elegido: A) cambiar clave · B) desactivar */
    tutorialOperador: function (nombre) {
      const o = this.OPERADORES[nombre];
      return {
        titulo: "Protege tu buzón - " + nombre,
        sub: "Elige cómo quieres proteger tu buzón de voz.",
        opciones: [
          { etiqueta: "Cambiar la clave", pasos: [
              "Marca <code>" + o.codigo + "</code> desde tu celular.",
              ...o.pasos,
              "Elige una clave de 6 dígitos que no sea 1234 ni tu cumpleaños." ] },
          { etiqueta: "Desactivar el buzón", pasos: PASOS_DESACTIVAR }
        ]
      };
    },

    NOTA_MENU: "Los nombres de los menús y los códigos pueden variar según tu celular, versión u operador. Si algo no coincide, consulta con tu operador.",

    /* Íconos SVG del resultado: escudo (a salvo) y alerta (riesgo) */
    ICONOS: {
      escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l8 3v6.3c0 4.7-3.3 8.4-8 9.7-4.7-1.3-8-5-8-9.7V5.5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
      alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18.2v.1"/></svg>'
    }
  };
})(window.CV = window.CV || {});
