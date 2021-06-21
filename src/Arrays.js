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
