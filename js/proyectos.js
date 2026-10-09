/*==========================================================
PROYECTOS.JS
Solo se carga en html/proyectos.html.

Filtra el listado por categoría, actualiza el contador de
resultados y muestra un aviso si no queda ninguno.
Antes estaba escrito con <script> dentro del HTML.
==========================================================*/

(function () {
    "use strict";

    var botones = document.querySelectorAll(".filtro-btn");
    var proyectos = document.querySelectorAll(".proyecto-fila");
    var contador = document.getElementById("contador-num");
    var vacio = document.getElementById("proyectos-vacio");

    if (!botones.length || !proyectos.length) return;

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            botones.forEach(function (b) { b.classList.remove("active"); });
            boton.classList.add("active");

            var filtro = boton.getAttribute("data-filtro");
            var visibles = 0;

            proyectos.forEach(function (proyecto) {

                var coincide = filtro === "todos" ||
                               proyecto.getAttribute("data-categoria") === filtro;

                proyecto.classList.toggle("oculto", !coincide);

                if (coincide) visibles++;
            });

            if (contador) contador.textContent = visibles;
            if (vacio) vacio.classList.toggle("visible", visibles === 0);
        });
    });

})();
