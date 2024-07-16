function mostrarPantallaSiguienteGrupo() {
    paused = true;
    document.getElementById("next-group-modal").classList.remove("hidden");
    document.getElementById("modal-title").innerText = "El siguiente grupo es el " + roscos[current_rosco_i].nombregrupo;
    let tiempo = 3;
    document.getElementById("modal-btn").innerText = tiempo;
    let interval = setInterval(() => {
        tiempo--;
        document.getElementById("modal-btn").innerText = tiempo;
        console.log(tiempo);
        if (tiempo === 0) {
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
    while (paused) {
        await new Promise(r => setTimeout(r, 100));
    }

    ///////////////////

    roscos[current_rosco_i].reloadRosco(document, cambioRosco);
}

function esconderPantallaSiguienteGrupo() {
    paused = false;
    document.getElementById("next-group-modal").classList.add("hidden");
}
function loadEventListeners() {

    //document.getElementById("modal-btn").addEventListener("click",);

    document.getElementById("btn-ok").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];

        currentRosco.acertarLetra(document);

        if(currentRosco.aciertos === Rosco.LETRAS.length){
            document.getElementById("end-modal").classList.remove("hidden");
            
        } else {
            currentRosco.siguienteLetra(document);
            currentRosco.resetTiempo(document);
        }
    })

    document.getElementById("btn-error").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];

        currentRosco.errorLetra(document);
        currentRosco.siguienteLetraEscondida(document);
        currentRosco.resetTiempo(document);

        cambioRosco();
    })

    document.getElementById("btn-pasa").addEventListener("click", (e) => {
        let currentRosco = roscos[current_rosco_i];

        currentRosco.siguienteLetraEscondida(document);
        currentRosco.resetTiempo(document);

        cambioRosco();
    })
}

function jugar() {
    gana = null;
    roscos = [];

    let repetido = [];

    // Aqui se añaden los identificadores de cada set de preguntas cargados en index.html
    let preguntas = (mode == "kids") ?
        // Preguntas niños    
        [
            PREGUNTAS1J,
            PREGUNTAS2J,
            PREGUNTAS3J,
            PREGUNTAS4J,
            PREGUNTAS5J,
            PREGUNTAS6J,
        ] :
        // Preguntas adultos
        [
            PREGUNTAS1,
            PREGUNTAS2,
            PREGUNTAS3,
            PREGUNTAS4,
            PREGUNTAS5,
            PREGUNTAS6,
            
        ];

    for (let grupo of groups) {

        // WIP: Hacer un do while mientras el set de preguntas esté en repetido, es decir ya se haya usado en un rosco anterior
        let setPreguntas = ~~(Math.random() * preguntas.length);
        repetido.push(setPreguntas);

        roscos.push(
            // Aqui se reparte aleatoriamente un set de preguntas distinto
            new Rosco(grupo.toUpperCase(), preguntas[setPreguntas])
        )
    }

    current_rosco_i = 0;

    roscos[current_rosco_i].reloadRosco(document, cambioRosco);
    let tiempo = new Tiempo(globalTime, 0);
    let interval = setInterval(() => {
        tiempo.restartiempo();
        tiempo.minutos;
        tiempo.segundos;
        document.getElementById("tiempo-global").innerText = tiempo.minutos + ":" + tiempo.segundos;
    }, 1000);
}

function modeWindow() {
    document.getElementById("config-time-modal").classList.add("hidden");
    document.getElementById("config-mode-modal").classList.remove("hidden");
}
function groupWindow() {
    document.getElementById("config-mode-modal").classList.add("hidden");
    document.getElementById("config-groups-modal").classList.remove("hidden");
}

function configuracion() {
    document.getElementById("config-time-btn").addEventListener("click", () => {
        globalTime = +document.getElementById("cnfg-global-time").value;
        document.getElementById("tiempo-global").innerText = globalTime + ":00"
        modeWindow();
    })


    document.getElementById("config-modal-btn-kids").addEventListener("click", () => {
        mode = "kids";
        groupWindow();
    });

    document.getElementById("config-modal-btn-adults").addEventListener("click", () => {
        mode = "adults";
        groupWindow();
    });

    for (let v of "123456789") {
        let btn = document.getElementById(`group-${v}-btn`);

        btn.addEventListener("click", () => {
            if (btn.classList.contains("selected")) {
                btn.classList.remove("selected");
            } else {
                btn.classList.add("selected");
            }
        });
    }

    document.getElementById(`group-accept-btn`).addEventListener("click", () => {
        for (let v of "123456789") {
            let btn = document.getElementById(`group-${v}-btn`);
            if (btn.classList.contains("selected")) groups.push(btn.innerText);
        }

        document.getElementById("config-groups-modal").classList.add("hidden");

        jugar();
    })

}


// Pensar que pasa si un grupo gana
let gana = null;
let current_rosco_i;
let roscos = [];
let paused = false;

let mode = null;
let globalTime = 19;
let groups = [];

window.onload = () => {
    configuracion();

    loadEventListeners();
};