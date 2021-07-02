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

        }
    }
}