class PolynomialModel {
    //Polinomial model that will be inherited by Polynomial Regression
    constructor() {
        this.isFit = false;
    }
}

class PolynomialRegression extends PolynomialModel {
    //PolynomialRegression code
    constructor() {
        super();
        this.solutions = [];
    }

    //Method that trains the model in order to create the regression
    fit(xArray, yArray, degree) {
        //Equation matrix size based on the degree and number of elements
        let equationSize = degree + 1;
        let nElements = degree + 2;

        //Equation matrix to be solved
        let equations = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            equations[i] = new Array(nElements);
        }

        //Building equation matrix
        for (let i = 0; i < equationSize; i++) {
            for (let j = 0; j < nElements; j++) {
                let sum = 0;
                if (i == 0 && j == 0) {
                    sum = xArray.length;
                }
                else if (j == nElements - 1) {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], i) * yArray[k];
                    }
                }
                else {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], (j + i));
                    }
                }
                equations[i][j] = sum;
            }
        }

        //Staggering matrix
        for (let i = 1; i < equationSize; i++) {
            for (let j = 0; j <= i - 1; j++) {
                let factor = equations[i][j] / equations[j][j];
                for (let k = j; k < nElements; k++) {
                    equations[i][k] = equations[i][k] - factor * equations[j][k];
                }
            }
        }

        //Solving matrix
        for (let i = equationSize - 1; i > -1; i--) {
            for (let j = equationSize - 1; j > -1; j--) {
                if (i == j) {
                    equations[i][nElements - 1] = equations[i][nElements - 1] / equations[i][j];
                }
                else if (equations[i][j] != 0) {
                    equations[i][nElements - 1] -= equations[i][j] * equations[j][nElements - 1];
                }
            }
        }

        //Storing solutions
        this.solutions = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            this.solutions[i] = equations[i][nElements - 1];
        }

        //Setting Model as trained
        this.isFit = true;
    }

    //Function that creates a prediction based in the regression model
    predict(xArray) {
        let yArray = [];
        //Checking if the model is already trained
        if (this.isFit) {
            //Generating the predictions based in the input and solutions
            for (let i = 0; i < xArray.length; i++) {
                let yprediction = 0;
                for (let j = 0; j < this.solutions.length; j++) {
                    yprediction += this.solutions[j] * Math.pow(xArray[i], j);
                }
                yArray.push(yprediction);
            }
        }

        //Returning Prediction
        return yArray;
    }
}