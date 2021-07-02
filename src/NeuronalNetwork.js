class Matriz {

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = 0;
        }


    }

    static multiply(m1, m2) {

        if (m1.cols !== m2.rows) {
            console.log("Cannot Operate, Check Matrix Multiplication Rules.");
            return undefined;
        } else {
            let result = new Matrix(m1.rows, m2.cols);

            for (let i = 0; i < result.rows; i++)
                for (let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < m1.cols; k++) {
                        sum += m1.data[i][k] * m2.data[k][j];
                    }
                    result.data[i][j] = sum;
                }
            return result;

        }
    }
    multiply(n) {
        if (n instanceof Matrix) {

            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n.data[i][j];

        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n;
        }
    }
}