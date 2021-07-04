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

    // http://github.com/AlexDenver

    static multiplicar(m1, m2) {

        if (m1.cols !== m2.rows) {
            console.log("Cannot Operate, Check Matriz Multiplication Rules.");
            return undefined;
        } else {
            let result = new Matriz(m1.rows, m2.cols);

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
    multiplicar(n) {
        if (n instanceof Matriz) {

            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n.data[i][j];

        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n;
        }
    }

    summar(n) {
        if (n instanceof Matriz) {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n.data[i][j];
        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n;
        }

    }

    static resstar(a, b) {
        let res = new Matriz(a.rows, a.cols);
        for (let i = 0; i < a.rows; i++)
            for (let j = 0; j < a.cols; j++)
                res.data[i][j] = a.data[i][j] - b.data[i][j];
        return res;
    }

    mapear(func) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val);
            }
    }

    static mapear(m, func) {
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++) {
                let val = m.data[i][j];
                m.data[i][j] = func(val);
            }
        return m;
    }

    tirar_random() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = (Math.random() * 2) - 1;  //between -1 and 1
    }

    static transpuesta(m) {
        let res = new Matriz(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                res.data[j][i] = m.data[i][j];
        return res;
    }

    imprimir() {
        console.table(this.data);
    }

    convert_to_array() {
        let arr = [];
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                arr.push(this.data[i][j]);
        return arr;
    }

    static get_array(array) {
        let m = new Matriz(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        // m.print();
        return m;
    }


}


class LayerLink {

    constructor(prevNode_count, node_count) {
        this.weights = new Matriz(node_count, prevNode_count);
        this.bias = new Matriz(node_count, 1);
        this.weights.tirar_random();
        this.bias.tirar_random();

        //http://github.com/AlexDenver

        //console.table(this.weights.data)
        //console.table(this.bias.data)
    }

    actualizar_Weights(weights) {
        this.weights = weights;
    }
    obtener_Weights() {
        return this.weights;
    }
    obtener_Bias() {
        return this.bias;
    }
    summar(deltaWeight, bias) {
        this.weights.summar(deltaWeight);
        this.bias.summar(bias);
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
                this.Set_aprendizaje_rate(parseFloat(options.learning_rate));
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

    Predecir(input_array) {

        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        let input = Matriz.get_array(input_array);
        let layerResult = input;
        for (let i = 0; i < this.layerCount; i++) {
            layerResult = Matriz.multiplicar(this.layerLink[i].obtener_Weights(), layerResult);
            layerResult.summar(this.layerLink[i].obtener_Bias());
            layerResult.mapear(this.options.activation);
        }
        // The Last Layer Result will be the Final Output.
        return layerResult.convert_to_array();
    }

    Set_aprendizaje_rate(n) {
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

    Entrenar(input_array, target_array) {
        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        if (target_array.length !== this.output_nodes) {
            console.error(`This Instance of NeuralNetwork Expects ${this.output_nodes} Outputs, ${target_array.length} Provided.`);
            return { outputs: target_array };
        }
        let input = Matriz.get_array(input_array);
        // Array to Store/Track each Layer Weighted Result (sum)
        let layerResult = [];
        layerResult[0] = input;  // Since input is First Layer.
        // Predicting the Result for Given Input, Store Output of each Consequent layer
        for (let i = 0; i < this.layerCount; i++) {
            layerResult[i + 1] = Matriz.multiplicar(this.layerLink[i].obtener_Weights(), layerResult[i]);
            layerResult[i + 1].summar(this.layerLink[i].obtener_Bias());
            layerResult[i + 1].mapear(this.options.activation);
        }

        let targets = Matriz.get_array(target_array);
        // Variables to Store Errors and Gradients at each Layer.
        let layerErrors = [];
        let gradients = [];

        // Calculate Actual Error based on Target.
        layerErrors[this.layerCount] = Matriz.resstar(targets, layerResult[this.layerCount]);

        // Correcting and Recalculating Error for each Layer
        for (let i = this.layerCount; i > 0; i--) {
            // Calculate the Layer Gradient 
            // dyE/dyW = learning_rate * layerError * sigmoid(x) * (1-sigmoid(x)); 
            // NOTE: dsigmoid = sigmoid(x) * (1-sigmoid(x) ie derivative of sigmoid

            gradients[i] = Matriz.mapear(layerResult[i], this.options.derivative);
            gradients[i].multiplicar(layerErrors[i]);
            gradients[i].multiplicar(this.learning_rate);

            // Calculate the Changes to be made to the weighs
            let hidden_T = Matriz.transpuesta(layerResult[i - 1]);
            let weight_ho_deltas = Matriz.multiplicar(gradients[i], hidden_T);

            // Update the Weights and Gradient According to Deltas & Gradient.
            this.layerLink[i - 1].summar(weight_ho_deltas, gradients[i]);

            // Calculate the Previous Layer Errors (Proportional Error based on Current Layer Error.)
            // NOTE: We are Backpropogating, Therefore we are going backwards 1 step (i.e. i-1)
            layerErrors[i - 1] = Matriz.multiplicar(Matriz.transpuesta(this.layerLink[i - 1].obtener_Weights()), layerErrors[i]);
        }

    }

}