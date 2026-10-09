# METALES DD · metalesdd.es

Sitio web corporativo de METALES DD, taller de cerrajería y estructuras
metálicas en la Comunidad de Madrid. HTML, CSS y JavaScript sin
dependencias ni proceso de compilación: se sube por FTP y funciona.

## Estructura

```
.
├── index.html                 Portada
├── 404.html                   Página de error
├── html/                      Resto de páginas
│   ├── empresa.html
│   ├── servicios.html
│   ├── proyectos.html
│   ├── contacto.html
│   ├── aviso-legal.html
│   └── privacidad.html
├── css/
│   ├── base.css               Variables, reset, contenedores, utilidades
│   ├── layout.css             Cabecera, navegación y pie
│   ├── components.css         Botones, títulos, heroes, formularios, CTA, cookies
│   └── pages/                 Lo exclusivo de cada página
│       ├── home.css
│       ├── empresa.css
│       ├── servicios.css
│       ├── proyectos.css
│       ├── contacto.css
│       └── legal.css          Aviso legal, privacidad y 404
├── js/
│   ├── main.js                Común a todas las páginas
│   ├── home.js                Slider y animación del logo (solo portada)
│   └── proyectos.js           Filtros del listado (solo proyectos)
├── images/
├── procesar-formulario.php    Recepción de los formularios de contacto
├── .htaccess                  HTTPS, sin www, gzip, caché y página 404
├── robots.txt
└── sitemap.xml
```

## Cómo se carga el CSS

Todas las páginas cargan las hojas en el mismo orden, de lo más general
a lo más concreto:

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/pages/home.css">
```

Así una página siempre puede afinar un componente sin recurrir a
`!important`, y no hace falta un archivo aparte de correcciones: cada
media query vive junto al bloque que modifica.

## Puntos de corte

Se usan estos seis y solo estos seis, siempre con `max-width`:

| Ancho  | Qué cambia                                          |
|--------|-----------------------------------------------------|
| 1400px | el diseño ancho de escritorio pasa a una columna     |
| 1200px | portátiles pequeños y escalado de pantalla al 125-150 % |
| 1000px | tablets en horizontal                                |
| 900px  | a partir de aquí aparece el menú hamburguesa         |
| 700px  | móviles                                              |
| 380px  | móviles pequeños                                     |

## Dos reglas del proyecto

1. **El margen lateral lo pone siempre el contenedor.** `.container` y
   `.container-wide` aplican `padding-inline: var(--gutter)`. Una sección
   que comparta elemento con ellos usa `padding-block` (o
   `padding-top` / `padding-bottom`), **nunca el atajo `padding`**, porque
   el atajo pone el lateral a 0 y el contenido se queda pegado al borde
   de la pantalla.

2. **El alto de la cabecera es una variable.** `--header-height` la usan
   el menú desplegable, la barra de filtros sticky y el `scroll-margin`
   de las anclas, así que basta con cambiarla en un sitio.

## Pendiente

- El enlace de Facebook del pie apunta a `https://www.facebook.com/metalesdd`.
  Hay que sustituirlo por la URL real de la página.
- El teléfono del pie de `html/empresa.html` (+34 756 857 483) no coincide
  con el del resto del sitio (+34 640 207 193).
