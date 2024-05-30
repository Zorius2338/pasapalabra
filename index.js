function mostrarPantallaSiguienteGrupo() {
    paused = true;
    document.getElementById("next-group-modal").classList.remove("hidden");
    document.getElementById("modal-title").innerText = "El siguiente grupo es el " + roscos[current_rosco_i].nombregrupo;
    let tiempo = 3;
    document.getElementById("modal-btn").innerText = tiempo;
    let interval = setInterval(()=> {
        tiempo--;
        document.getElementById("modal-btn").innerText = tiempo;
        console.log(tiempo);
        if(tiempo === 0){
            esconderPantallaSiguienteGrupo();
            clearInterval(interval);
        }
    }, 1000);
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

function esconderPantallaSiguienteGrupo(){
    paused = false;
    document.getElementById("next-group-modal").classList.add("hidden");
}
function loadEventListeners() {

    //document.getElementById("modal-btn").addEventListener("click",);

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
        new Rosco("AZUL", PREGUNTAS1),
        new Rosco("VERDE", PREGUNTAS1),
        new Rosco("AMARILLO", PREGUNTAS1)
    ];
    current_rosco_i = 0;

    roscos[current_rosco_i].reloadRosco(document, cambioRosco);
    let tiempo = new Tiempo(15,0);
    let interval = setInterval(()=> {
        tiempo.restartiempo();
        tiempo.minutos;
        tiempo.segundos;
        document.getElementById("tiempo-global").innerText = tiempo.minutos + ":" + tiempo.segundos;
    }, 1000);
}

const LETRAS = "abcdefghijklmnñopqrstuvwxyz".toLowerCase();

// Pensar que pasa si un grupo gana
let gana = null;
let current_rosco_i;
let roscos = [];
let paused = false;

window.onload = () => {
    loadEventListeners();

    configuracion();

    jugar();
};