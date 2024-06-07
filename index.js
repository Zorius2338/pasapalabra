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
    
    for(let grupo of groups) {
        console.log(grupo);
        roscos.push(
            new Rosco(grupo.toUpperCase(), PREGUNTAS1)
        )
    }

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

function groupWindow() {
    document.getElementById("config-mode-modal").classList.add("hidden");
    document.getElementById("config-groups-modal").classList.remove("hidden");
}

function configuracion() {
    document.getElementById("config-modal-btn-kids").addEventListener("click", () => {
        mode = "kids";
        groupWindow();
    });
    
    document.getElementById("config-modal-btn-adults").addEventListener("click", () => {
        mode = "adults";
        groupWindow();
    });

    for(let v of "123456789") {
        let btn = document.getElementById(`group-${v}-btn`);
        
        btn.addEventListener("click", () => {
            if(btn.classList.contains("selected")) {
                btn.classList.remove("selected");
            } else {
                btn.classList.add("selected");
            }
        });
    }
    
    document.getElementById(`group-accept-btn`).addEventListener("click", () => {
        for(let v of "123456789") {
            let btn = document.getElementById(`group-${v}-btn`);
            if(btn.classList.contains("selected")) groups.push(btn.innerText);
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
let groups = [];

window.onload = () => {
    configuracion();
    
    loadEventListeners();
};