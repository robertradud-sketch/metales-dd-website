/*==========================================================
MAIN.JS
Comportamiento común a TODAS las páginas: cabecera al hacer
scroll, menú hamburguesa, animaciones de entrada, contadores,
formularios de contacto y aviso de cookies.

Los archivos específicos de una página van aparte:
    home.js       slider del hero y animación del logo
    proyectos.js  filtros del listado de proyectos
==========================================================*/

(function () {
    "use strict";

    /*======================================================
    CABECERA: cambia de color al bajar
    ======================================================*/

    var header = document.querySelector("header");

    if (header) {
        window.addEventListener("scroll", function () {
            header.classList.toggle("scrolled", window.scrollY > 50);
        });
    }


    /*======================================================
    MENÚ HAMBURGUESA
    ======================================================*/

    function initMenu() {

        var toggle = document.getElementById("menuToggle");
        var menu = document.getElementById("mainMenu");

        if (!toggle || !menu) return;

        function cerrar() {
            menu.classList.remove("open");
            toggle.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }

        toggle.addEventListener("click", function () {
            var abierto = menu.classList.toggle("open");
            toggle.classList.toggle("open", abierto);
            toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
        });

        // Cerrar al pulsar cualquier enlace de dentro
        menu.querySelectorAll("a").forEach(function (enlace) {
            enlace.addEventListener("click", cerrar);
        });

        // Cerrar si la pantalla vuelve a ser lo bastante ancha
        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) cerrar();
        });
    }


    /*======================================================
    ANIMACIONES DE ENTRADA AL HACER SCROLL
    Añade .in-view cuando el elemento asoma en pantalla.
    ======================================================*/

    function initReveals() {

        var elementos = document.querySelectorAll(
            ".service-card, .reveal-left, .reveal-right, .reveal-up, .reveal-fade"
        );

        if (!elementos.length) return;

        var observer = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("in-view");
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        elementos.forEach(function (el) {
            observer.observe(el);
        });
    }


    /*======================================================
    CONTADORES
    Los números suben desde 0 hasta su valor al hacer scroll.
    ======================================================*/

    function initCounters() {

        var contadores = document.querySelectorAll("[data-count]");

        if (!contadores.length) return;

        function animar(el) {

            var objetivo = parseInt(el.getAttribute("data-count"), 10);
            var prefijo = el.getAttribute("data-prefix") || "";
            var sufijo = el.getAttribute("data-suffix") || "";
            var duracion = 1500;
            var inicio = performance.now();

            function paso(ahora) {
                var avance = Math.min((ahora - inicio) / duracion, 1);
                var suavizado = 1 - Math.pow(1 - avance, 3);

                el.textContent = prefijo + Math.round(objetivo * suavizado) + sufijo;

                if (avance < 1) {
                    requestAnimationFrame(paso);
                } else {
                    el.textContent = prefijo + objetivo + sufijo;
                }
            }

            requestAnimationFrame(paso);
        }

        var observer = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    animar(entrada.target);
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        contadores.forEach(function (el) {
            observer.observe(el);
        });
    }


    /*======================================================
    FORMULARIOS DE CONTACTO
    El mismo comportamiento para el de la portada y el de
    contacto.html; solo cambia la ruta del PHP.
    ======================================================*/

    function initFormulario(form, ruta) {

        if (!form) return;

        var boton = form.querySelector('button[type="submit"]');
        var feedback = form.querySelector(".form-feedback");
        var textoOriginal = boton ? boton.textContent : "";

        form.addEventListener("submit", function (e) {

            e.preventDefault(); // evita que la página se recargue

            if (boton) {
                boton.disabled = true;
                boton.textContent = "Enviando...";
            }

            fetch(ruta, { method: "POST", body: new FormData(form) })
                .then(function (respuesta) { return respuesta.json(); })
                .then(function (resultado) {

                    if (feedback) {
                        feedback.textContent = resultado.mensaje;
                        feedback.style.color = resultado.ok ? "green" : "red";
                        feedback.classList.add("visible");
                    }

                    if (resultado.ok) form.reset();
                })
                .catch(function () {
                    if (feedback) {
                        feedback.textContent = "Error de conexión. Inténtalo de nuevo.";
                        feedback.style.color = "red";
                        feedback.classList.add("visible");
                    }
                })
                .finally(function () {
                    if (boton) {
                        boton.disabled = false;
                        boton.textContent = textoOriginal;
                    }
                });
        });
    }


    /*======================================================
    AVISO DE COOKIES (mapa de Google Maps)

    El mapa solo se carga si se aceptan. El botón flotante
    está escondido por CSS y aparece al pasar el ratón; aquí
    solo se le añade .is-visible mientras el aviso está
    abierto, para que no desaparezca debajo del cursor.
    ======================================================*/

    function initCookies() {

        var banner = document.getElementById("cookie-banner");
        var icono = document.getElementById("cookie-icon");

        if (!banner || !icono) return;

        var mapa = document.querySelector("iframe[data-src]");
        var aviso = document.getElementById("mapPlaceholder");
        var avisoBtn = document.getElementById("mapPlaceholderBtn");
        var consentimiento = localStorage.getItem("cookies-maps");

        function mostrarBanner(visible) {
            banner.style.display = visible ? "flex" : "none";
            icono.classList.toggle("is-visible", visible);
        }

        function cargarMapa() {
            if (mapa && !mapa.src) mapa.src = mapa.dataset.src;
            if (mapa) mapa.style.display = "";
            if (aviso) aviso.style.display = "none";
        }

        function ocultarMapa() {
            if (mapa) mapa.style.display = "none";
            if (aviso) aviso.style.display = "flex";
        }

        if (consentimiento === "accepted") {
            cargarMapa();
        } else {
            ocultarMapa();
        }

        // Se muestra solo la primera vez; después queda el botón flotante
        if (!consentimiento) mostrarBanner(true);

        icono.addEventListener("click", function () {
            mostrarBanner(banner.style.display !== "flex");
        });

        if (avisoBtn) {
            avisoBtn.addEventListener("click", function () {
                mostrarBanner(true);
            });
        }

        function decidir(valor) {
            localStorage.setItem("cookies-maps", valor);
            if (valor === "accepted") { cargarMapa(); } else { ocultarMapa(); }
            mostrarBanner(false);
        }

        var aceptar = document.getElementById("cookie-accept");
        var rechazar = document.getElementById("cookie-reject");

        if (aceptar) aceptar.addEventListener("click", function () { decidir("accepted"); });
        if (rechazar) rechazar.addEventListener("click", function () { decidir("rejected"); });
    }


    /*======================================================
    ARRANQUE
    ======================================================*/

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initReveals();
        initCounters();
        initCookies();
        initFormulario(document.querySelector("#form-home"), "procesar-formulario.php");
        initFormulario(document.querySelector("#form-contacto"), "../procesar-formulario.php");
    });

})();
