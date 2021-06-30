/**
 * Euclidean: calculates the distance from A to B
 * using euclidean distance. The points accept n dimensions
 * @param {array} pointA 
 * @param {array} pointB 
 * @returns distance from A to B
 */
function euclidean(pointA, pointB){
  var sum = 0
  for(var i=0; i < pointA.length; i++){
    sum += Math.pow(pointA[i]-pointB[i], 2)
  }
  return (Math.sqrt(sum)).toFixed(5)
}

/**
 * Manhattan: calculates the distance from A to B
 * using manhattan distance. The points accept n dimensions
 * @param {array} pointA 
 * @param {array} pointB 
 * @returns distance from A to B
 */
function manhattan(pointA, pointB) {
  var sum = 0
  for(var i=0; i < pointA.length; i++){
    sum += Math.abs(pointA[i]-pointB[i])
  }
  return sum
}
