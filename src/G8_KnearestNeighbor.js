
function calcularDistanciaManhattan(datos, newIndividuo) {
    let distancias = [];

    let i = 0;
    while(i < datos.length) {
        
        let y = 0;
        let dist = 0;
        let individuo = datos[i];
        
        while(y < individuo.length) {

            let puntoNuevo = newIndividuo[1][y];
            let puntoDato = individuo[1][y];

            let op = puntoDato - puntoNuevo;
            dist += Math.abs(op);

            y++;
        }
        distancias.push(dist);
        i++;
        
    }
    console.log(distancias);
    return distancias;
}

function calcularDistanciaEuclidiana(datos, newIndividuo) {
    let distancias = [];

    let i = 0;
    while(i < datos.length){
        
        let y = 0;
        let dist = 0;
        let individuo = datos[i];
        
        while(y < individuo.length){

            let puntoNuevo = newIndividuo[1][y];
            let puntoDato = individuo[1][y];

            let resta = puntoDato - puntoNuevo;
            dist += Math.pow(resta, 2);

            y++;
        }
        let raiz = Math.sqrt(dist);
        distancias.push(raiz);
        i++;
        
    }
    console.log(distancias);
    return distancias;
}

function predecirCluster(tipo, datos, newIndividuo) {
    let distancias;

    if(tipo === 1) {
        distancias = calcularDistanciaManhattan(datos, newIndividuo);    
    }else {
        distancias = calcularDistanciaEuclidiana(datos, newIndividuo);
    }

    let menor;
    for(let i = 0; i < distancias.length; i++) {
        if(menor) {
            if(distancias[i] < menor) {
                menor = distancias[i];
            }
        }else {
            menor = distancias[i];
        }
    }

    let resp = "";

    for(let i = 0; i < distancias.length; i++) {
        if(distancias[i] === menor) {

            if(resp.length === 0) {
                resp = datos[i][2];
            }else {
                resp += "," + datos[i][2];
            }
        }
    }
    return `El individuo ${newIndividuo[0]} pertenece a: ${resp}`;
}