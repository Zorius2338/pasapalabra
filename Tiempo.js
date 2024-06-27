class Tiempo{
    #minutos;
    #segundos;
    constructor(minutos,segundos){
        this.#minutos = minutos;
        this.#segundos = segundos;
    }
    get segundos(){
        return (this.#segundos<10)?"0"+this.#segundos : this.#segundos; 
    }
    get minutos(){
        return (this.#minutos)
    }
  restartiempo(){
    if(this.#minutos === 0 && this.#segundos === 0) return;
    
    this.#segundos--;
    if (this.#segundos == -1 && this.minutos > 0) {
        this.#minutos--;
        this.#segundos = 59;
    }
  }  
}