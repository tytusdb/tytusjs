var tabla = new Array(
    new Array("Outlook",    "Temperature",  "Humidity", "Windy",    "Class"),   // Usuario
    new Array("sunny",      "hot",          "high",     "false",    "N"),
    new Array("sunny",      "hot",          "high",     "true",     "N"),
    new Array("overcast",   "hot",          "high",     "false",    "P"),
    new Array("rain",       "mild",         "high",     "false",    "P"),
    new Array("rain",       "cool",         "normal",   "false",    "P"),
    new Array("rain",       "cool",         "normal",   "true",     "N"),
    new Array("overcast",   "cool",         "normal",   "true",     "P"),
    new Array("sunny",      "mild",         "high",     "false",    "N"),
    new Array("sunny",      "cool",         "normal",   "false",    "P"),
    new Array("rain",       "mild",         "normal",   "false",    "P"),
    new Array("sunny",      "mild",         "normal",   "true",     "P"),
    new Array("overcast",   "mild",         "high",     "true",     "P"),
    new Array("overcast",   "hot",          "normal",   "false",    "P"),
    new Array("rain",       "mild",         "high",     "true",     "N")
);

var ejemplo2 = new Array(
    new Array("Empleo",  "Ingresos", "Credito"),
    new Array("si",      "3000",     "P"),
    new Array("si",      "1000",     "N"),
    new Array("no",      "0",        "N"),
    new Array("si",      "1500",     "P"),
    new Array("si",      "2000",     "P"),
    new Array("no",      "0",        "N"),
);

var ejemplo3 = new Array(
    new Array("Presion Arterial",  "Urea en Sangre", "Gota", "Hipotiroidismo", "Admin"),
    new Array("Alta",   "Alta",   "Si", "No", "No"),
    new Array("Alta",   "Alta",   "Si", "Si", "No"),
    new Array("Normal", "Alta",   "Si", "No", "Si"),
    new Array("Baja",   "Normal", "Si", "No", "Si"),
    new Array("Baja",   "Baja",   "No", "No", "Si"),
    new Array("Baja",   "Baja",   "No", "Si", "No"),
    new Array("Normal", "Baja",   "No", "Si", "Si"),
    new Array("Alta",   "Normal", "Si", "No", "No"),
    new Array("Alta",   "Baja",   "No", "No", "Si"),
    new Array("Baja",   "Normal", "No", "No", "Si"),
    new Array("Alta",   "Normal", "No", "Si", "Si"),
    new Array("Normal", "Normal", "Si", "Si", "Si"),
    new Array("Normal", "Alta",   "No", "No", "Si"),
    new Array("Baja",   "Normal", "Si", "Si", "No")
);

var ejemplo1 = new Array(
    new Array("Outlook",    "Temperature",  "Humidity", "Windy",    "Class"),   // Usuario
    new Array("sunny",      "hot",          "high",     "false",    "N"),
    new Array("sunny",      "hot",          "high",     "true",     "N"),
    new Array("overcast",   "hot",          "high",     "false",    "P"),
    new Array("rain",       "mild",         "high",     "false",    "P"),
    new Array("rain",       "cool",         "normal",   "false",    "P"),
    new Array("rain",       "cool",         "normal",   "true",     "N"),
    new Array("overcast",   "cool",         "normal",   "true",     "P"),
    new Array("sunny",      "mild",         "high",     "false",    "N"),
    new Array("sunny",      "cool",         "normal",   "false",    "P"),
    new Array("rain",       "mild",         "normal",   "false",    "P"),
    new Array("sunny",      "mild",         "normal",   "true",     "P"),
    new Array("overcast",   "mild",         "high",     "true",     "P"),
    new Array("overcast",   "hot",          "normal",   "false",    "P"),
    new Array("rain",       "mild",         "high",     "true",     "N")
);

var varGanar = "P";                                                     // Usuario
var varPerder = "N";                                                    // Usuario
var totalGanar = 0;
var totalPerder = 0;
var total = 0
var varIG = 0;
var varEntropia = 0;
var varGanancia = 0;

function cantidad(varClass, atributos){
    let contador = 0;
    for(let x=1; x<atributos.length; x++){
        if(varClass == atributos[x][atributos[0].length-1]){
            contador++;
        }
    }
    return contador;
}

function cantidadPosicion(atributo, ganar, pos, atributos){
    let contador = 0;
    for(let x=1; x<atributos.length; x++){
        if(atributo == atributos[x][pos] && ganar == atributos[x][atributos[0].length-1]){
            contador++;
        }
    }
    return contador;
}

function atributo(nombre){
    this.nombre = nombre;
    this.ganar = 0;
    this.perder = 0;
    this.info = 0;
}

function listaAtributo(pos, atributos){
    let lista = new Set()
    for(let x=1; x<atributos.length; x++){
        lista.add(atributos[x][pos]);;
    }
    let lista2 = new Array();
    let x = 0;
    for(let v of lista.values()){
        let atr = new atributo(v);
        lista2[x++] = atr;
    }
    return lista2;
}

function revisionNulo(valor){
    if(!isNaN(valor)){
        return valor;
    }
    return 0;
}

function informacionGeneral(){
    let info = 0;
    let p = totalGanar/(totalGanar+totalPerder)
    let n = totalPerder/(totalGanar+totalPerder)
    info = -p * Math.log2(p) - n * Math.log2(n);
    return info;
}

function entropia(pos, atributos){
    /*
     * Obtener valore de ganados y perdidos
    */
    let listaAtributos = listaAtributo(pos,atributos);
    for(let x=0; x<listaAtributos.length; x++){
        for(let y=1; y<atributos.length; y++){
            let atributo = atributos[y][pos];
            if(atributo == listaAtributos[x].nombre && varGanar == atributos[y][atributos[0].length-1]){
                listaAtributos[x].ganar++;
            }else if(atributo == listaAtributos[x].nombre && varPerder == atributos[y][atributos[0].length-1]){
                listaAtributos[x].perder++;
            }
        }
    }
    /*
     * Obtener informacion de cada valor del arreglo
    */
    for(let x=0; x<listaAtributos.length; x++){
        let p = listaAtributos[x].ganar/(listaAtributos[x].ganar+listaAtributos[x].perder)
        let n = listaAtributos[x].perder/(listaAtributos[x].ganar+listaAtributos[x].perder)
        let info = -p * Math.log2(p) - n * Math.log2(n);
        listaAtributos[x].info = revisionNulo(info);
        //console.log(listaAtributos[x].nombre + ": " + listaAtributos[x].info)
    }
    /*
     * Obtener entropia
    */
    let entropia = 0;
    for(let x=0; x<listaAtributos.length; x++){
        let li = listaAtributos[x].ganar + listaAtributos[x].perder;
        let ld = totalGanar + totalPerder;
        entropia += (li)/(ld)*listaAtributos[x].info;
    }

    return entropia;
}

function ganancia(certeza, incertidumbre){
    return certeza - incertidumbre;
}

function id3(atributos){
    totalGanar = cantidad(varGanar, atributos);
    totalPerder = cantidad(varPerder, atributos);
    total = totalGanar + totalPerder;
    varIG = informacionGeneral();
    //let arr = atributos;
    let mejorGanancia = 0;
    let nombreMG = "";
    for(let x=1; x<atributos[0].length; x++){
        //console.log("==========================================================================================>");
        varEntropia = entropia(x-1, atributos)
        varGanancia = ganancia(varIG, varEntropia)
        //console.log("Ganancia "+atributos[0][x-1]+": " + varGanancia);
        if(varGanancia > mejorGanancia){
            mejorGanancia = varGanancia;
            nombreMG = atributos[0][x-1];
        }
    }
    //console.log("Mejor Ganancia -> "+nombreMG + ": " + mejorGanancia);
    return nombreMG;
}

function convertirTabla(indice, tablaPadre){
    let lista = new Array();
    let pos = 0;
    let fila = new Array()
    for(let y=1; y< tablaPadre[0].length; y++){
        fila[y-1] = tablaPadre[0][y]
    }
    lista[pos++] = fila;
    for(let x=0; x< tablaPadre.length; x++){
        if(indice == tablaPadre[x][0]){
            let fila = new Array()
            for(let y=1; y< tablaPadre[0].length; y++){
                fila[y-1] = tablaPadre[x][y]
            }
            lista[pos++] = fila;
        }
    }
    return lista;
}

function obtenerPosicionEncabezado(nombre, tabla){
    for(let x=0; x<tabla[0].length; x++){
        if(nombre == tabla[0][x]){
            return x;
        }
    }
    return 0;
}

function revisarAmbiguedad(tabla, valor, indice){
    let ganar = 0;
    let perder = 0;
    for(let x=0; x<tabla.length; x++){
        if(tabla[x][indice] == valor && tabla[x][tabla[0].length-1]==varGanar){
            ganar++;
        }else if(tabla[x][indice] == valor && tabla[x][tabla[0].length-1]==varPerder){
            perder++;
        }
    }
    if(ganar == 0 || perder == 0){
        if(ganar == 0){
            return varPerder;
        }
        return varGanar;
    }
    return true;
}

let iterador = 1;
function getNodo(padre, listadoSinRepetir, tablaPadre, nodoRaiz){
    let dot = "";
    for(let y=0; y<listadoSinRepetir.length; y++){
        let indiceActual = iterador++;
        dot += padre  + "--" + (indiceActual) + " [label=\""+listadoSinRepetir[y].nombre+"\"];";    // Creamos nodo hijo
        let indice = obtenerPosicionEncabezado(nodoRaiz, tablaPadre);
        let ambiguo = revisarAmbiguedad(tablaPadre, listadoSinRepetir[y].nombre, indice);
        let cuerpoNodoActual = varGanar;
        if(ambiguo == true){
            let nuevaTabla = convertirTabla(listadoSinRepetir[y].nombre, tablaPadre);
            cuerpoNodoActual = id3(nuevaTabla);
            let indiceEncabezado = obtenerPosicionEncabezado(cuerpoNodoActual, nuevaTabla);
            let listaSinRepetir = listaAtributo(indiceEncabezado,nuevaTabla);
            dot += getNodo(indiceActual, listaSinRepetir, nuevaTabla, cuerpoNodoActual);
        }else if(ambiguo == varPerder){
            cuerpoNodoActual = varPerder;
        }
        dot += (indiceActual) + " [label=\""+cuerpoNodoActual+"\"];";
    }
    return dot;
}

function treeDirec(){
    var dot = 'graph {'
    let nodoRaiz = id3(tabla);     // Nodo Raiz

    dot += (iterador++) + " [label=\""+nodoRaiz+"\"];";
    let indice = obtenerPosicionEncabezado(nodoRaiz, tabla);
    let listaSinRepetir = listaAtributo(indice,tabla);
    dot += getNodo(iterador-1, listaSinRepetir, tabla, nodoRaiz);

    dot += "}"
    console.log(dot)
    return dot;
}

function Mejemplo1(){
    //vis-network
    var parent = document.getElementById("b");
    var child = document.getElementById("mynetwork");
    parent.removeChild(child);
    //<div id="mynetwork"></div>
    var di = document.createElement("div")
    di.id = "mynetwork"; 
    document.getElementById("b").appendChild(di);

    tabla = ejemplo3;
    var container = document.getElementById("mynetwork");
    var DOTstring = treeDirec();
    var parsedData = vis.network.convertDot(DOTstring);
    var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
    }
    var options = {
            layout: {
                hierarchical: {
                        levelSeparation: 100,
                        nodeSpacing: 100,
                        parentCentralization: true,
                        direction: 'UD',        // UD, DU, LR, RL
                        sortMethod: 'directed',  // hubsize, directed
                        //shakeTowards: 'roots'  // roots, leaves                        
            },
            },                        
    };
    var network = new vis.Network(container, data, options);
}

function Mejemplo2(){
    //vis-network
    var parent = document.getElementById("b");
    var child = document.getElementById("mynetwork");
    parent.removeChild(child);
    //<div id="mynetwork"></div>
    var di = document.createElement("div")
    di.id = "mynetwork"; 
    document.getElementById("b").appendChild(di);

    tabla = ejemplo2;
    var container = document.getElementById("mynetwork");
    var DOTstring = treeDirec();
    var parsedData = vis.network.convertDot(DOTstring);
    var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
    }
    var options = {
            layout: {
                hierarchical: {
                        levelSeparation: 100,
                        nodeSpacing: 100,
                        parentCentralization: true,
                        direction: 'UD',        // UD, DU, LR, RL
                        sortMethod: 'directed',  // hubsize, directed
                        //shakeTowards: 'roots'  // roots, leaves                        
            },
            },                        
    }; 
    var network = new vis.Network(container, data, options);   
}

function Mejemplo3(){
    //vis-network
    var parent = document.getElementById("b");
    var child = document.getElementById("mynetwork");
    parent.removeChild(child);
    //<div id="mynetwork"></div>
    var di = document.createElement("div")
    di.id = "mynetwork"; 
    document.getElementById("b").appendChild(di);

    tabla = ejemplo1;
    var container = document.getElementById("mynetwork");
    var DOTstring = treeDirec();
    var parsedData = vis.network.convertDot(DOTstring);
    var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
    }
    var options = {
            layout: {
                hierarchical: {
                        levelSeparation: 100,
                        nodeSpacing: 100,
                        parentCentralization: true,
                        direction: 'UD',        // UD, DU, LR, RL
                        sortMethod: 'directed',  // hubsize, directed
                        //shakeTowards: 'roots'  // roots, leaves                        
            },
            },                        
    };
    var network = new vis.Network(container, data, options);
}