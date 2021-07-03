class FuzzySet {
  constructor(individuals = []) {
    this.individuals = individuals
    this.minsAndMaxs = this.calculateMinsAndMax()
  }

  calculateMinsAndMax() {
    var ret = [[],[],[]]
    var dimensions = this.individuals[0].length - 1
    for (let i = 0; i < this.individuals.length; i++) {
      for (let j=0; j < dimensions; j++){
        if (ret[j][0] == undefined) ret[j][0] = this.individuals[i][j]
        else {
          ret[j][0] = Math.min(ret[j][0], this.individuals[i][j])
        }
        if (ret[j][1] == undefined) ret[j][1] = this.individuals[i][j]
        else {
          ret[j][1]= Math.max(ret[j][1], this.individuals[i][j])
        }
      }
    }
    return ret
  }

  normalization() {
    var ret = []
    var dimensions = this.individuals[0].length - 1
    for (let i = 0; i < this.individuals.length; i++) {
      let norm = []
      for (let j=0; j < dimensions; j++) {
        if(this.individuals[i][j] <= this.minsAndMaxs[j][0]) {
          norm.push(0)
        } else if(this.individuals[i][j] >= this.minsAndMaxs[j][1]) {
          norm.push(1)
        } else {
          norm.push(((this.individuals[i][j] - this.minsAndMaxs[j][0]) / (this.minsAndMaxs[j][1]-this.minsAndMaxs[j][0])).toFixed(5))
        }
      }
      ret.push(norm)
    }
    return ret
  }

  euclidean(point) {
    var dimensions = this.individuals[0].length - 1
    var normalization = this.normalization()
    var normPoint = []
    for (let i = 0; i < point.length; i++) {
      if(point[i] <= this.minsAndMaxs[i][0]) {
        normPoint.push(0)
      } else if(point[i] >= this.minsAndMaxs[i][1]) {
        normPoint.push(1)
      } else {
        normPoint.push(((point[i] - this.minsAndMaxs[i][0]) / (this.minsAndMaxs[i][1]-this.minsAndMaxs[i][0])).toFixed(5))
      }
    }
    var distance = []
    for (const individual of normalization) {
      var individual_point = individual.slice(0, dimensions)
      distance.push(euclidean(normPoint, individual_point))
    }
    let min = Math.min(... distance)
    let group = []
    for (const d in distance) {
      if(distance[d]==min) {
        group.push(this.individuals[d][dimensions])
      }
    }
    return [...new Set(group)]
  }

  manhattan(point) {
    var dimensions = this.individuals[0].length - 1
    var normalization = this.normalization()
    var normPoint = []
    for (let i = 0; i < point.length; i++) {
      if(point[i] <= this.minsAndMaxs[i][0]) {
        normPoint.push(0)
      } else if(point[i] >= this.minsAndMaxs[i][1]) {
        normPoint.push(1)
      } else {
        normPoint.push(((point[i] - this.minsAndMaxs[i][0]) / (this.minsAndMaxs[i][1]-this.minsAndMaxs[i][0])).toFixed(5))
      }
    }
    var distance = []
    for (const individual of normalization) {
      var individual_point = individual.slice(0, dimensions)
      distance.push(manhattan(normPoint, individual_point))
    }
    let min = Math.min(... distance)
    let group = []
    for (const d in distance) {
      if(distance[d]==min) {
        group.push(this.individuals[d][dimensions])
      }
    }
    return [...new Set(group)]
  }
}