
function LineLeastSquares(reqx, reqy) {
    
    var squaredsumx = 0;
    var sumxy = 0;
    var numElement = 0;
    var x_sum = 0;
    var y_sum = 0;
    var x = 0;
    var y = 0;

    /*
     * Variables para almacenar los valores Fitness
     */
    var resx = [];
    var resy = [];


    if (reqx.length != reqy.length) {
        throw new Error('Los array ingresados deben ser del mismo tamaño');
    }

    /**
     * Metódo para calcular las sumatorias de los valores de:
     * Sumatoria xx
     * Sumatoria xy
     * Sumatoria de x
     * Sumatoria de y
     * Cantidad de elementos los cuales son representados en la equación como N.
     */
    for (let i = 0; i< reqx.length; i++) {
        x = reqx[i];
        y = reqy[i];
        x_sum+= x;
        y_sum+= y;
        squaredsumx += x*x;
        sumxy += x*y;
        numElement++;
    }

    /*
    * Calculo de pendiente. 
    * Calculo del valor b. 
    */
    var m = (numElement*sumxy - x_sum*y_sum) / (numElement*squaredsumx - x_sum*x_sum);
    var b = (y_sum/numElement) - (m*x_sum)/numElement;


    /*
     * Valores resultantes al aplicar la ecuación. 
     */
    for (let i = 0; i < reqx.length; i++) {
        x = reqx[i];
        y = x * m + b;
        resy.push(y);
    }

    /**
     * Respuesta de los valores de la pendiente, el valor de b y los valores resultantes.
     */
    return [m, b,resy];
}