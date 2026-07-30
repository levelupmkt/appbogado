# Sistema de estilos · AppBogado

Fuente de verdad del diseño: [`02-BRAND.md`](../02-BRAND.md)
Recursos (fuentes, logos, iconos, imágenes): [`public/`](../public/)

## Cómo se enlaza

Un solo `<link>` por página. `main.css` importa todo lo demás en orden de cascada.

```html
<!-- index-institucional.html (raíz) -->
<link rel="stylesheet" href="css/main.css">

<!-- landings/*.html -->
<link rel="stylesheet" href="../css/main.css">
```

## Estructura

```
css/
├── tokens/
│   ├── primitives.css   NIVEL 1 · valores crudos (#000033, 1rem, 280ms…)
│   ├── semantic.css     NIVEL 2 · intención (--surface-brand, --action-primary-bg)
│   └── components.css   NIVEL 3 · por componente (--button-primary-bg, --footer-bg)
├── base/
│   ├── fonts.css        @font-face → public/fonts (Britanica, Urbanist)
│   ├── reset.css        normalización + propiedades globales
│   └── typography.css   escala fluida de titulares y cuerpo
├── layout/
│   ├── sections.css     .container, .section y fondos alternados
│   ├── grid.css         .grid, .split, .stack, .cluster, .media
│   └── navigation.css   header fijo, menú móvil y footer
├── components/
│   ├── buttons.css      .btn y variantes
│   ├── hero.css         .hero
│   ├── cards.css        .card, .cta-band
│   ├── features.css     .feature, .icon-badge, .check-list, .pill, .stat
│   └── forms.css        .field, .input, .search, .form-card
├── utilities/
│   └── helpers.css      .visually-hidden, .reveal, espaciado puntual
└── main.css             único punto de entrada (@import)
```

## Las 3 capas de tokens

Regla de oro: **cada capa solo consume la anterior**. Ningún archivo de
`layout/` o `components/` escribe un HEX ni usa un token primitivo.

| Nivel | Archivo | Responde a | Ejemplo |
|---|---|---|---|
| 1 · Primitivo | `tokens/primitives.css` | ¿Qué valor es? | `--color-orange-500: #FF4C12` |
| 2 · Semántico | `tokens/semantic.css` | ¿Para qué sirve? | `--action-primary-bg: var(--color-orange-500)` |
| 3 · Componente | `tokens/components.css` | ¿Dónde se aplica? | `--button-primary-bg: var(--action-primary-bg)` |

Consecuencias prácticas:

- Cambiar el naranja de marca = **1 línea** en `primitives.css`; se propaga a todo.
- Cambiar solo el hover de los botones = **1 línea** en `components.css`, sin tocar `buttons.css`.
- Añadir un componente nuevo = declarar sus tokens en `components.css` y escribir su CSS consumiéndolos.

## Contextos de color

En vez de duplicar componentes para fondo claro y oscuro, el contenedor
reasigna los tokens de texto y borde:

```html
<section class="section section--brand on-brand">
  <!-- .btn--secondary, .card, los enlaces y los títulos
       se adaptan solos al fondo azul -->
</section>
```

Clases disponibles: `.on-brand`, `.on-gradient`, `.on-accent`.

## Reglas de marca ya codificadas

| Regla de 02-BRAND.md | Token / clase |
|---|---|
| Hero y footer en degradado azul | `--hero-bg`, `--footer-bg` · `.section--gradient` |
| Convenios institucionales en `#000033` | `--surface-brand` · `.section--brand` |
| Las 4 cards de "Todo tu despacho" en `#000033` | `.card--brand` |
| Secciones estratégicas en `#E8E8E8` | `--surface-strategic` · `.section--strategic` |
| CTA y enlaces sobre azul en `#FF4C12` | `--action-primary-bg`, `--link-on-brand-hover` |
| Hover del menú en naranja | `--nav-link-color-hover` |
| Botones blancos con hover `#FFB7A0` | `--button-inverse-bg-hover` |
| Titulares en Britanica, cuerpo en Urbanist | `--font-display`, `--font-body` |

## Responsive

Mobile-first. La tipografía y los espaciados verticales usan `clamp()`, así que
escalan sin media queries. Los breakpoints reales solo aparecen para cambios de
composición:

| Alias | Valor | Uso |
|---|---|---|
| sm | 480px | CTA a ancho completo |
| md | 640px | grillas de 1 → 2 columnas |
| lg | 1024px | menú de escritorio, grillas de 3–5 columnas, `.split` |
| xl | 1280px | ajustes finos |

## JavaScript

| Archivo | Función |
|---|---|
| [`js/ui.js`](../js/ui.js) | menú móvil, sombra del header, `.reveal`, filtros |
| [`js/leads.js`](../js/leads.js) | envío de formularios de campaña y atribución UTM |

Enganches por atributo: `data-header`, `data-nav-toggle`, `data-nav-panel`,
`data-filter-group`, `data-ab-form`, `data-ab-success`.
