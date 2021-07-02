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

    predict(input_array) {

        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        let input = Matriz.fromArray(input_array);
        let layerResult = input;
        for (let i = 0; i < this.layerCount; i++) {
            layerResult = Matriz.multiply(this.layerLink[i].getWeights(), layerResult);
            layerResult.add(this.layerLink[i].getBias());
            layerResult.map(this.options.activation);
        }
        // The Last Layer Result will be the Final Output.
        return layerResult.toArray();
    }

    setLearningRate(n) {
        if (n > 1 && n < 100) {
            n = n / 100;
        } else {
            console.error("Set Learning Rate Between (0 - 1) or (1 - 100)");
            return;
        }
        if (n > 0.3) {
            console.warn("It is recommended to Set Lower Learning Rates");
        }
        this.learning_rate = n;
    }

    train(input_array, target_array) {
        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        if (target_array.length !== this.output_nodes) {
            console.error(`This Instance of NeuralNetwork Expects ${this.output_nodes} Outputs, ${target_array.length} Provided.`);
            return { outputs: target_array };
        }
        let input = Matrix.fromArray(input_array);
        // Array to Store/Track each Layer Weighted Result (sum)
        let layerResult = [];
        layerResult[0] = input;  // Since input is First Layer.
        // Predicting the Result for Given Input, Store Output of each Consequent layer
        for (let i = 0; i < this.layerCount; i++) {
            layerResult[i + 1] = Matrix.multiply(this.layerLink[i].getWeights(), layerResult[i]);
            layerResult[i + 1].add(this.layerLink[i].getBias());
            layerResult[i + 1].map(this.options.activation);
        }

        let targets = Matrix.fromArray(target_array);
        // Variables to Store Errors and Gradients at each Layer.
        let layerErrors = [];
        let gradients = [];

        // Calculate Actual Error based on Target.
        layerErrors[this.layerCount] = Matrix.subtract(targets, layerResult[this.layerCount]);


    }

}