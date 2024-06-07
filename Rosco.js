class Rosco {

    static LETRAS = "abcdefghijlmnñopqrstuvxyz".toLowerCase();
    static CORRECTO = "2"
    static PASAR = "1"
    static ERROR = "0"

    static TIEMPO = 20;
    
    constructor(nombregrupo, preguntas) {
        this.tiempo = Rosco.TIEMPO;
        this.aciertos = 0;
        this.letra = Rosco.LETRAS[0];
        this.i_letra = 0;
        this.estadoletra = Array(Rosco.LETRAS.length).fill(Rosco.PASAR)
        this.nombregrupo = nombregrupo
        this.preguntas = preguntas;
        this.timer = null;
    }

    reloadRosco(document, siguienteRoscoFnc) {        
        let roscoBox = document.getElementById("rosco");
        roscoBox.innerHTML = "";
        
        let nombregrupo = document.createElement("div");
        nombregrupo.setAttribute("id", "nombre-grupo");
        nombregrupo.innerText = this.nombregrupo;
        nombregrupo.classList.add(this.nombregrupo.toLowerCase());


        let aciertos = document.createElement("div");
        aciertos.setAttribute("id", "aciertos");
        aciertos.innerText = this.aciertos;

        let segundos = document.createElement("div");
        segundos.setAttribute("id", "segundos");
        segundos.innerText = this.tiempo;

        roscoBox.appendChild(aciertos);
        roscoBox.appendChild(segundos);
        roscoBox.appendChild(nombregrupo);

        let radius = ~~(Math.min(roscoBox.offsetHeight, roscoBox.offsetWidth) / 2) - 20;
        let offsetX = ~~roscoBox.offsetWidth / 2 - radius;
        let offsetY = ~~roscoBox.offsetHeight / 2 - radius;

        let esferaOffset = parseFloat(getComputedStyle(document.documentElement).fontSize);

        for (let i = 0; i < Rosco.LETRAS.length; i++) {
            let letra = Rosco.LETRAS[i];

            let esfera = document.createElement("div");
            esfera.setAttribute("id", "esfera-" + letra);
            switch (this.estadoletra[i]) {
                case Rosco.CORRECTO:
                    esfera.setAttribute("class", "esfera acierto");
                    break;
                case Rosco.ERROR:
                    esfera.setAttribute("class", "esfera fallo");
                    break;
                case Rosco.PASAR:
                    esfera.setAttribute("class", "esfera");
                    break;
            }

            esfera.innerText = letra.toUpperCase();

            var angle = ((i - Rosco.LETRAS.length / 4) / Rosco.LETRAS.length) * 2 * Math.PI;
            var x = ~~(-esferaOffset + radius + radius * Math.cos(angle));
            var y = ~~(-esferaOffset + radius + radius * Math.sin(angle));

            esfera.style.top = offsetY + y + "px";
            esfera.style.left = offsetX + x + "px";

            roscoBox.appendChild(esfera);

        }
        document.getElementById("esfera-" + this.letra).classList.add("current");
        let letra_u = this.letra.toUpperCase();
        document.getElementById("pregunta").innerText = this.preguntas[letra_u][0] + letra_u + ": " + this.preguntas[letra_u][1];

        this.empezarContador(document, siguienteRoscoFnc);
    }

    acertarLetra(document) {
        document.getElementById("esfera-" + this.letra).classList.add("acierto");
        this.aciertos++;
        document.getElementById("aciertos").innerText = this.aciertos;

        this.estadoletra[this.i_letra] = Rosco.CORRECTO;
    }

    siguienteLetraEscondida() {
        document.getElementById("esfera-" + this.letra).classList.remove("current");
        this.i_letra++;
        this.i_letra = this.i_letra % Rosco.LETRAS.length;
        this.letra = Rosco.LETRAS[this.i_letra];
        document.getElementById("esfera-" + this.letra).classList.add("current");
    }

    siguienteLetra(document) {
        document.getElementById("esfera-" + this.letra).classList.remove("current");
        this.i_letra++;
        this.i_letra = this.i_letra % Rosco.LETRAS.length;
        this.letra = Rosco.LETRAS[this.i_letra];
        let letra_u = this.letra.toUpperCase();

        document.getElementById("esfera-" + this.letra).classList.add("current");
        document.getElementById("pregunta").innerText = this.preguntas[letra_u][0] + letra_u + ": " + this.preguntas[letra_u][1];
    }

    errorLetra(document) {
        document.getElementById("esfera-" + this.letra).classList.add("fallo");
        this.estadoletra[this.i_letra] = Rosco.ERROR;
    }

    resetTiempo(document) {
        this.tiempo = Rosco.TIEMPO;
        document.getElementById("segundos").innerText = this.tiempo;
    }

    limpiarContador() {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    empezarContador(document, siguienteRoscoFnc) {
        this.timer = setInterval(() => {
            if (this.tiempo === 0) {
                this.resetTiempo(document);
                this.siguienteLetra(document)
                siguienteRoscoFnc();
            } else {
                this.tiempo--;
                document.getElementById("segundos").innerText = this.tiempo;
            }

        }, 1000);
    }
}
