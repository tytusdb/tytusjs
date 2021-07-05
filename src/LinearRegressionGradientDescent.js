//Longitud Datos
const M = 9;


const x = [7, 1, 10, 5, 4, 3, 13, 10, 2];
const y = [2, 9, 2, 5, 7, 11, 2, 5, 14];

const tasaAprendisaje = 0.0005;

let theta1 = 0;
let thetaInicial = 0;

const h = x => thetaInicial + theta1 * x;

const learn = (alpha) => {
  let thetaSum = 0;
  let theta1Sum = 0;
  for (let i = 0; i < M; i++) {
    thetaSum += h(x[i]) - y[i];
    theta1Sum += (h(x[i]) - y[i]) * x[i];
  }
  thetaInicial = thetaInicial - (alpha / M) * thetaSum;
  theta1 = theta1 - (alpha / M) * theta1Sum;
}

const cost = () => {
  let sum = 0;
  for (let i = 0; i < M; i++) {
    sum += Math.pow(h(x[i]) - y[i], 2);
  }
  return sum / (2 * M);
}


let iteration = 0;
function GradienteDescendente()
{
    var ValoresPosibles = [];
    var i;
    for (i = 0; i < 180000; i++) {
        learn(tasaAprendisaje);
        if((i%6000)===0)
        {
            let auxfunct = "f(x) = " + thetaInicial.toFixed(2) + " + " + theta1.toFixed(2) + "x";
            let auxdata = {"Iteracion":i,"Funcion":auxfunct};
            ValoresPosibles.push(auxdata);
        }
        i++;
    }
    let auxfunct = "f(x) = " + thetaInicial.toFixed(2) + " + " + theta1.toFixed(2) + "x";
    let auxdata = {"Iteracion":i,"Funcion":auxfunct};
    ValoresPosibles.push(auxdata);
    return ValoresPosibles;
}

