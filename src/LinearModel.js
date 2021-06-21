class LinearModel {
    constructor() {
        this.isFit = false
    }
}

class LinearRegression extends LinearModel {
    constructor() {
        super()
        this.m = 0
        this.b = 0
    }

    fit(xTrain, yTrain) {
        var sumX = 0
        var sumY = 0
        var sumXY = 0
        var sumXX = 0
        for(var i = 0; i < xTrain.length; i++) {
            sumX += xTrain[i]
            sumY += yTrain[i]
            sumXY += xTrain[i] * yTrain[i]
            sumXX += xTrain[i]*xTrain[i]
        }
        this.m = (xTrain.length * sumXY - sumX * sumY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))
        this.b = (sumY * sumXX - sumX * sumXY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))        
        this.isFit = true
    }

    predict(xTest) {
        var yPredict = []
        if (this.isFit) {
            for(var i = 0; i < xTest.length; i++) {
                yPredict.push(this.m * xTest[i] + this.b)
            }            
        }
        return yPredict
    }
}
