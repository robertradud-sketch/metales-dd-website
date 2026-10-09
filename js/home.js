/*==========================================================
HOME.JS
Solo se carga en index.html.

Antes esto vivía en el script común, así que en el resto de
páginas el slider intentaba arrancar sin diapositivas y
lanzaba un error en consola cada 5 segundos.
==========================================================*/

(function () {
    "use strict";

    /*======================================================
    SLIDER DEL HERO
    Va alternando las fotos de fondo cada 5 segundos.
    ======================================================*/

    var slides = document.querySelectorAll(".slide");

    if (slides.length > 1) {

        var actual = 0;

        setInterval(function () {
            slides[actual].classList.remove("active");
            actual = (actual + 1) % slides.length;
            slides[actual].classList.add("active");
        }, 5000);
    }


    /*======================================================
    ANIMACIÓN DEL LOGO · "POR QUÉ ELEGIRNOS"

    Solo se anima en escritorio ancho. Por debajo de 1400px
    el CSS oculta las palabras y el logo, así que no tiene
    sentido cargar la animación: se veía mal y consumía
    batería en móvil para nada.
    ======================================================*/

    var animacionVisible = window.matchMedia("(min-width: 1401px)").matches;
    var movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animacionVisible || movimientoReducido) return;

    if (typeof gsap === "undefined") {
        console.warn("GSAP no se cargó: se omite la animación decorativa de 'Por qué elegirnos'.");
        return;
    }

    gsap.timeline({ repeat: -1, repeatDelay: 1 })

        .fromTo(".calidad",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: .8 })

        .fromTo(".precision",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: .8 })

        .fromTo(".compromiso",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: .8 })

        .to(".word",
            { opacity: 0, duration: .8, delay: 2 })

        .fromTo(".logo-final",
            { opacity: 0, scale: .7 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" })

        .to(".logo-final",
            { opacity: 0, duration: .8, delay: 2 });

})();
