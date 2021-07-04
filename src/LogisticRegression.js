class LogisticModel {
    constructor() {
    }
}

class LogisticRegression extends LogisticModel {
    constructor() {
        super()  
        this.alpha = 0.001;
        this.lambda = 0;
        this.iterations = 100;     
    }

    // Fit regression
    fit(data) {
        console.log(data)
        this.dim = data[0].length;
        var N = data.length;
        
        var X = [];
        var Y = [];
        for(var i=0; i < N; ++i){
            var row = data[i];
            var x_i = [];
            var y_i = row[row.length-1];
            x_i.push(1.0);
            for(var j=0; j < row.length-1; ++j){
                x_i.push(row[j]);
            }
            X.push(x_i);
            Y.push(y_i);
        }
        
        this.theta = [];
        for(var d = 0; d < this.dim; ++d){
            this.theta.push(0.0);
        }
        
        for(var iter = 0; iter < this.iterations; ++iter){
            var theta_delta = this.grad(X, Y, this.theta);
            for(var d = 0; d < this.dim; ++d){
                this.theta[d] = this.theta[d] - this.alpha * theta_delta[d];        
            }
        }
        
        this.threshold = this.computeThreshold(X, Y);
        
        return {
            theta: this.theta,
            threshold: this.threshold,
            cost: this.cost(X, Y, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations 
            }
        }
    };
    
    computeThreshold(X, Y){
        var threshold=1.0, N = X.length;
        
        for (var i = 0; i < N; ++i) {
            var prob = this.transform(X[i]);
            if(Y[i] == 1 && threshold > prob){
                threshold = prob;
            }
        }
        
        return threshold;
    }
    // gradiente
    grad(X, Y, theta) {
        try {
            var N = X.length;
            var Vx = [];
            for(var d = 0; d < this.dim; ++d) {
                var sum = 0.0;
                for(var i = 0; i < N; ++i){
                    var x_i = X[i];
                    var predicted = this.h(x_i, theta);
                    sum += ((predicted - Y[i]) * x_i[d] + this.lambda * theta[d]) / N;
                }    
                Vx.push(sum);
            }
            
            return Vx;
        }catch(e){
            console.log(e)
        }
    }
    //valor h function predicted
    h(x_i, theta) {
        try {
            var gx = 0.0;
            for(var d = 0; d < this.dim; ++d){
                gx += theta[d] * x_i[d];
            }
            return 1.0 / (1.0 + Math.exp(-gx));
        } catch(e){
            console.log(e)
        }
    }
    // transformar
    transform(x) {
        console.log("VALOR DE X: "+x)
        if(x[0].length){ // x is a matrix            
            var predicted_array = [];
            console.log("LOGITUD : " + x.length)
            for(var i=0; i < x.length; ++i){
                var predicted = this.transform(x[i]);
                predicted_array.push(predicted);
            }
            return predicted_array;
        }
        
        var x_i = [];
        x_i.push(1.0);
        for(var j=0; j < x.length; ++j){
            x_i.push(x[j]);
        }
        return this.h(x_i, this.theta);
    }
   //costo 
    cost(X, Y, theta) {
        var N = X.length;
        var sum = 0;
        for(var i = 0; i < N; ++i){
            var y_i = Y[i];
            var x_i = X[i];
            sum += - (y_i * Math.log(this.h(x_i, theta)) + (1-y_i) * Math.log(1 - this.h(x_i, theta))) / N;
        }
        
        for(var d = 0; d < this.dim; ++d) {
            sum += (this.lambda * theta[d] * theta[d]) / (2.0 * N);
        }
        return sum;
    };
}


class MultiClassLogistic extends LogisticModel {
    constructor() {
        super()  
        this.alpha = 0.001;
        this.lambda = 0;
        this.iterations = 100;     
    }
    fit(data, classes) {
        this.dim = data[0].length;
        var N = data.length;
        
        if(!classes){
            classes = [];
            for(var i=0; i < N; ++i){
                var found = false;
                var label = data[i][this.dim-1];
                for(var j=0; j < classes.length; ++j){
                    if(label == classes[j]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    classes.push(label);
                }
            }
        }
        
        this.classes = classes;

        console.log(this.classes)
        
        this.logistics = {};
        var result = {};
        for(var k = 0; k < this.classes.length; ++k){
            var c = this.classes[k];
            this.logistics[c] = new LogisticRegression({
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            });
            var data_c = [];
            for(var i=0; i < N; ++i){
                var row = [];
                for(var j=0; j < this.dim-1; ++j){
                    row.push(data[i][j]);
                }
                row.push(data[i][this.dim-1] == c ? 1 : 0);
                data_c.push(row);
            }
            result[c] = this.logistics[c].fit(data_c);
        }
        return result;
    };
    
    transform(x) {
        if(x[0].length){ // x is a matrix            
            var predicted_array = [];
            for(var i=0; i < x.length; ++i){
                var predicted = this.transform(x[i]);
                predicted_array.push(predicted);
            }
            return predicted_array;
        }
        
        
        
        var max_prob = 0.0;
        var best_c = '';
        for(var k = 0; k < this.classes.length; ++k) {
            var c = this.classes[k];
            var prob_c = this.logistics[c].transform(x);
            if(max_prob < prob_c){
                max_prob = prob_c;
                best_c = c;
            }
        }
        
        return best_c;
    }
}