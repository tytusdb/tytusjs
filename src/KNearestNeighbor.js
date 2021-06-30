class KNearestNeighbor {
  constructor(individuals = []) {
    this.individuals = individuals
  }

  euclidean(point) {
    var distance = []
    var dimensions = this.individuals[0].length - 1
    for (const individual of this.individuals) {
      var individual_point = individual.slice(0, dimensions)
      distance.push(euclidean(point, individual_point))
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
    var distance = []
    var dimensions = this.individuals[0].length - 1
    for (const individual of this.individuals) {
      var individual_point = individual.slice(0, dimensions)
      distance.push(manhattan(point, individual_point))
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