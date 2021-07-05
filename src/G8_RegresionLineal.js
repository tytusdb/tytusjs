//Regresión lineal - Método de minimos cuadrados
let m, b;

function MinimosCuadrados(tabla){
    let sX = SumaX(tabla);
    let sY = SumaY(tabla);
    let sXY = SumaXY(tabla);
    let sX2 = SumaX2(tabla);
    let n = tabla.length;

    //Numerador
    let nDer = sX * sY / n;
    let Numerador = sXY - nDer;

    //Denominador
    let dDer = Math.pow(sX, 2) / n;
    let Denominador = sX2 - dDer;

    //Calculo de m
    m = Numerador / Denominador;

    //Calculo de b = Y - mX
    let pY = sY / n;
    let pX = sX / n;
    b = pY - (m * pX);

    console.log(sX, sY, sXY, sX2, n);
}

function Predecir(x) {
    let result = (m * x) + b;
    return [result,m,b];
}

function SumaX(tabla) {
    let n = tabla.length;
    let result = 0;

    for(let i = 0; i < n; i++) {
        result += tabla[i][0];
    }
    return result;
}

function SumaY(tabla) {
    let n = tabla.length;
    let result = 0;

    for(let i = 0; i < n; i++) {
        result += tabla[i][1];
    }
    return result;
}

function SumaXY(tabla) {
    let n = tabla.length;
    let result = 0;
    let xy = [];

    for(let i = 0; i < n; i++) {
        let x = tabla[i][0];
        let y = tabla[i][1];
        xy.push(x * y);
    }

    for(let i = 0; i < n; i++) {
        result += xy[i];
    }
    return result;
}

function SumaX2(tabla) {
    let n = tabla.length;
    let result = 0;
    let x2 = [];

    for(let i = 0; i < n; i++) {
        let x = tabla[i][0];
        x2.push(x * x);
    }

    for(let i = 0; i < n; i++) {
        result += x2[i];
    }
    return result;
}