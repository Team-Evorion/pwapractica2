const diapositivas = document.querySelectorAll(".diapositiva");
const indicadores = document.querySelectorAll(".indicador");

const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");

const numeroActual = document.getElementById("numeroActual");
const totalImagenes = document.getElementById("totalImagenes");
const rellenoProgreso = document.getElementById("rellenoProgreso");

const carrusel = document.querySelector(".carrusel");

let indiceActual = 0;
let temporizador;

const tiempoCambio = 5000;

totalImagenes.textContent = String(diapositivas.length).padStart(2, "0");

function mostrarDiapositiva(nuevoIndice) {

    if (nuevoIndice >= diapositivas.length) {
        indiceActual = 0;
    } else if (nuevoIndice < 0) {
        indiceActual = diapositivas.length - 1;
    } else {
        indiceActual = nuevoIndice;
    }

    diapositivas.forEach((diapositiva, indice) => {

        const estaActiva = indice === indiceActual;

        diapositiva.classList.toggle("activa", estaActiva);
        diapositiva.setAttribute("aria-hidden", !estaActiva);

    });

    indicadores.forEach((indicador, indice) => {

        const estaActivo = indice === indiceActual;

        indicador.classList.toggle("activo", estaActivo);

        if (estaActivo) {
            indicador.setAttribute("aria-current", "true");
        } else {
            indicador.removeAttribute("aria-current");
        }

    });

    numeroActual.textContent = String(indiceActual + 1).padStart(2, "0");

    reiniciarProgreso();
}

function mostrarSiguiente() {
    mostrarDiapositiva(indiceActual + 1);
}

function mostrarAnterior() {
    mostrarDiapositiva(indiceActual - 1);
}

function reiniciarProgreso() {

    rellenoProgreso.style.animation = "none";

    void rellenoProgreso.offsetWidth;

    rellenoProgreso.style.animation =
        `avance ${tiempoCambio}ms linear forwards`;
}

function iniciarCambioAutomatico() {

    clearInterval(temporizador);

    temporizador = setInterval(() => {
        mostrarSiguiente();
    }, tiempoCambio);

    reiniciarProgreso();
}

function detenerCambioAutomatico() {
    clearInterval(temporizador);
}

botonSiguiente.addEventListener("click", () => {
    mostrarSiguiente();
    iniciarCambioAutomatico();
});

botonAnterior.addEventListener("click", () => {
    mostrarAnterior();
    iniciarCambioAutomatico();
});

indicadores.forEach((indicador) => {

    indicador.addEventListener("click", () => {

        const indiceSeleccionado = Number(indicador.dataset.indice);

        mostrarDiapositiva(indiceSeleccionado);
        iniciarCambioAutomatico();

    });

});

document.addEventListener("keydown", (evento) => {

    if (evento.key === "ArrowRight") {
        mostrarSiguiente();
        iniciarCambioAutomatico();
    }

    if (evento.key === "ArrowLeft") {
        mostrarAnterior();
        iniciarCambioAutomatico();
    }

});

carrusel.addEventListener("mouseenter", () => {

    detenerCambioAutomatico();
    rellenoProgreso.style.animationPlayState = "paused";

});

carrusel.addEventListener("mouseleave", () => {

    iniciarCambioAutomatico();
    rellenoProgreso.style.animationPlayState = "running";

});

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
        detenerCambioAutomatico();
    } else {
        iniciarCambioAutomatico();
    }

});

mostrarDiapositiva(0);
iniciarCambioAutomatico();