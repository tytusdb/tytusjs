const distance = (a, b) => Math.sqrt(
  a.map((aPoint, i) => b[i] - aPoint)
    .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0)
);

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
    let min = Math.min(...distance)
    let group = []
    for (const d in distance) {
      if (distance[d] == min) {
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
    let min = Math.min(...distance)
    let group = []
    for (const d in distance) {
      if (distance[d] == min) {
        group.push(this.individuals[d][dimensions])
      }
    }
    return [...new Set(group)]
  }

  mapearGenerarDistancia(point) {

    const map = [];
    let maxDistanceInMap;

    for (let index = 0, len = this.data.length; index < len; index++) {
      const otroPunto = this.data[index];
      const otroPuntoLabel = this.labels[index];
      const distancia = distance(point, otroPunto);

      if (!maxDistanceInMap || distancia < maxDistanceInMap) {

        // Añador solo si es la mas cercana
        map.push({
          index,
          distance: distancia,
          label: otroPuntoLabel
        });

        // Ordenar el map
        map.sort((a, b) => a.distance < b.distance ? -1 : 1);

        // Si el map es muy grande, se elimina el item
        if (map.length > this.k) {
          map.pop();
        }

        // Actualizar el valor siguiente
        maxDistanceInMap = map[map.length - 1].distance;

      }
    }
    return map;
  }
}