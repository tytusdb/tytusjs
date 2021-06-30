function joinArrays() {
    var a = []
    if (arguments.length == 6) {
        a.push([arguments[0],arguments[2],arguments[4]])
        for(var i = 0; i < arguments[1].length; i++) {
            a.push([arguments[1][i],arguments[3][i],arguments[5][i]])
        }
    }
    return a
}

/**
 * Zip: Iterator of tuples where items 
 * paired together
 * @param {array} arrays 
 * @returns 
 */
function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}