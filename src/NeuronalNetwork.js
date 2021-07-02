class Matriz {
    // http://github.com/AlexDenver
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

    add(n) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n.data[i][j];
        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n;
        }

    }

    static subtract(a, b) {
        let res = new Matrix(a.rows, a.cols);
        for (let i = 0; i < a.rows; i++)
            for (let j = 0; j < a.cols; j++)
                res.data[i][j] = a.data[i][j] - b.data[i][j];
        return res;
    }

    map(func) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val);
            }
    }

    static map(m, func) {
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++) {
                let val = m.data[i][j];
                m.data[i][j] = func(val);
            }
        return m;
    }

    randomize() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = (Math.random() * 2) - 1;  //between -1 and 1
    }

    static transpose(m) {
        let res = new Matrix(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                res.data[j][i] = m.data[i][j];
        return res;
    }

    print() {
        console.table(this.data);
    }

    toArray() {
        let arr = [];
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                arr.push(this.data[i][j]);
        return arr;
    }

    static fromArray(array) {
        let m = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        // m.print();
        return m;
    }


}


class LayerLink {
    //http://github.com/AlexDenver
    constructor(prevNode_count, node_count) {
        this.weights = new Matriz(node_count, prevNode_count);
        this.bias = new Matriz(node_count, 1);
        this.weights.randomize();
        this.bias.randomize();

        //console.table(this.weights.data)
        //console.table(this.bias.data)
    }

    updateWeights(weights) {
        this.weights = weights;
    }
    getWeights() {
        return this.weights;
    }
    getBias() {
        return this.bias;
    }
    add(deltaWeight, bias) {
        this.weights.add(deltaWeight);
        this.bias.add(bias);
    }

}


class NeuralNetwork {
    //http://github.com/AlexDenver
    constructor(layers, options) {
        if (layers.length < 2) {
            console.error("Neural Network Needs Atleast 2 Layers To Work.");
            return { layers: layers };
        }
        this.options = {
            activation: function (x) {
                return (1 / (1 + Math.exp(-x)));
            },
            derivative: function (y) {
                return (y * (1 - y));
            }
        }
        this.learning_rate = 0.1;
        if (options) {
            if (options.learning_rate)
                this.setLearningRate(parseFloat(options.learning_rate));
            if (options.activation && options.derivative &&
                options.activation instanceof Function &&
                options.derivative instanceof Function) {
                this.options.activation = options.activation;
                this.options.derivative = options.derivative;
            } else {
                console.error("Check Documentation to Learn How To Set Custom Activation Function");
                console.warn("Documentation Link: http://github.com/AlexDenver")
                return { options: options };
            }
        }
        this.layerCount = layers.length - 1;   // Ignoring Output Layer.
        this.inputs = layers[0];
        this.output_nodes = layers[layers.length - 1];
        this.layerLink = [];
        for (let i = 1, j = 0; j < (this.layerCount); i++, j++) {
            if (layers[i] <= 0) {
                console.error("A Layer Needs To Have Atleast One Node (Neuron).");
                return { layers: layers };
            }
            this.layerLink[j] = new LayerLink(layers[j], layers[i]);    // Previous Layer Nodes & Current Layer Nodes
        }

    }

}