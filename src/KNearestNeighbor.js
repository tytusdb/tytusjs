class KNearestNeighbor {

  constructor(individuals = []) {
    this.individuals = individuals
  }

  //k;
  //data;
  //label;
  // Metodo para inicializar valores para metodo de calcular distancia
  inicializar(k, data, labels) {
    this.k = k;
    this.data = data;
    this.labels = labels;
  }

  /**
 * Calcula la distancia entre los dos puntos
 * Los puntos deben estar definidos como arreglos
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @return {number}
 */
  /*distance = (a, b) => Math.sqrt(
    a.map((aPoint, i) => b[i] - aPoint)
      .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0)
  );*/

  distance (a, b){ return Math.sqrt(
    a.map((aPoint, i) => b[i] - aPoint)
      .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0)
  );}

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
      const distancia = this.distance(point, otroPunto);

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

  /**
   * 
   * @param {[val1,val2]} point 
   * @returns json with the result
   */
  predecir(point) {

    const map = this.mapearGenerarDistancia(point);
    const votos = map.slice(0, this.k); //pasamos el valor k
    const votosCounts = votos
      // Reduce a un objeto tipo {label: voteCount}
      .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
      ;
    //Ordenar por medio del valor cantidad
    const sortedVotes = Object.keys(votosCounts)
      .map(label => ({ label, count: votosCounts[label] }))
      .sort((a, b) => a.count > b.count ? -1 : 1)
      ;

    return {
      label: sortedVotes[0].label,
      votosCounts,
      votos
    };

  }

}