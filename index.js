function mostrarPantallaSiguienteGrupo() {
    paused = true;
    document.getElementById("next-group-modal").classList.remove("hidden");
    document.getElementById("modal-title").innerText = "El siguiente grupo es el " + roscos[current_rosco_i].nombregrupo;
}

async function cambioRosco() {
    roscos[current_rosco_i].limpiarContador();

    current_rosco_i = (current_rosco_i + 1) % roscos.length;
    
    // WIP: codigo para esperar al siguiente grupo

    // mostrar ventana
    mostrarPantallaSiguienteGrupo();

    // esperar a input
    while(paused) {
        await new Promise(r => setTimeout(r, 100));
    }

    ///////////////////

    roscos[current_rosco_i].reloadRosco(document, cambioRosco);
}

function loadEventListeners() {
    document.getElementById("modal-btn").addEventListener("click", (e) => {
        paused = false;
        document.getElementById("next-group-modal").classList.add("hidden");
    });

    document.getElementById("btn-ok").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];
        
        currentRosco.acertarLetra(document);
        currentRosco.siguienteLetra(document);
        currentRosco.resetTiempo(document);
    })

    document.getElementById("btn-error").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];
        
        currentRosco.errorLetra(document);
        currentRosco.siguienteLetra(document);
        currentRosco.resetTiempo(document);

        cambioRosco();
    })
    
    document.getElementById("btn-pasa").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];

        currentRosco.siguienteLetra(document);
        currentRosco.resetTiempo(document);

        cambioRosco();
    })
}

function jugar() {
    gana = null;

    roscos = [
        new Rosco("Grupo A", PREGUNTAS),
        new Rosco("Grupo B", PREGUNTAS),
        new Rosco("Grupo C", PREGUNTAS)
    ];
    current_rosco_i = 0;

    roscos[current_rosco_i].reloadRosco(document, cambioRosco);
}

const LETRAS = "abcdefghijklmnñopqrstuvwxyz".toLowerCase();

// Pensar que pasa si un grupo gana
let gana = null;
let current_rosco_i;
let roscos = [];
let paused = false;

window.onload = () => {
    loadEventListeners();

    jugar();
};