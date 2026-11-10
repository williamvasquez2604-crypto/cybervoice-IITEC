# CyberVoice

Simulador de riesgo de hackeo por buzón de voz y WhatsApp. Sin dependencias ni servidor:
abre `index.html` con doble clic.

## Flujo de pantallas

`inicio` → `test` (6 preguntas) → `resultado` (puntaje, nivel y un botón) → `plan` (lista de problemas)
→ `tutorial` (dos opciones A/B + "He completado este paso") → vuelve al `plan` con ✅ y menos riesgo.

## Estructura

```
cybervoice/
├── index.html          Estructura de las 5 pantallas y orden de carga
├── css/
│   ├── base.css        Variables, fondo, tarjeta, textos y botones
│   ├── preguntas.css   Progreso y tipos de respuesta
│   ├── resultado.css   Pantalla de resultado (anillo, nivel)
│   ├── plan.css        Plan de acción y lista de operadores
│   ├── tutorial.css    Pestañas A/B y pasos numerados
│   └── efectos.css     Carga, avisos, confeti, responsive y accesibilidad
└── js/
    ├── config.js       Datos: preguntas, puntajes, problemas, tutoriales, operadores  (EDITAR AQUÍ)
    ├── estado.js       Estado compartido y cálculo de riesgo
    ├── ui.js           Utilidades: $, mostrar, cargar
    ├── validacion.js   Reglas del PIN
    ├── efectos.js      Confeti y avisos flotantes
    ├── riesgo.js       Nivel y número animado (compartido)
    ├── resultado.js    Pantalla de resultado
    ├── plan.js         Pantalla del plan de acción
    ├── tutorial.js     Pantalla de tutorial
    ├── preguntas.js    Flujo del test
    └── main.js         Arranque y eventos
```

El orden de los `<script>` en `index.html` importa. Todos comparten el espacio de nombres `CV`
(sin módulos ES, para que funcione con doble clic).

## Puntaje (máximo 130)

| Factor | Puntos |
|---|---|
| PIN débil o "no se" | 40 |
| Sin verificación en dos pasos | 30 |
| Compartió su código de 6 dígitos | 20 |
| Modo avión / ambos de noche | 15 |
| Llamadas perdidas caen al buzón | 15 |
| No sabe revisar dispositivos vinculados | 10 |

Niveles: 0-30 a salvo · 31-60 medio · 61+ crítico.

## Pendiente de verificar

Los códigos USSD por operador y el código para desactivar el buzón (`##004#`)
están en `js/config.js` (también los pasos de WhatsApp). Confírmalos con cada operador antes de publicar.
