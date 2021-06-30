class KMeans {
    constructor() {
        this.k = 3
    }
}

class LinearKMeans extends KMeans {
    constructor() {
        super()
        this.data = []
    }

    clusterize(k, data) {
        this.data = data
        let clusters = []

        //pendiente agregar iterations

        for (let i = 0; i < k; i++) {
            let c = data[Math.floor(Math.random() * data.length)]
            while (clusters.findIndex(x => x === c) != -1) {
                c = data[Math.floor(Math.random() * data.length)]
            }
            clusters.push(c)
        }

        clusters = clusters.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); })

        let distances = []
        let clustered_data = []

        let closer_cluster = 0, closer_distance = 0, first_distance = true;
        data.forEach(point => {
            closer_cluster = 0, closer_distance = 0, first_distance = true;

            clusters.forEach(c => {
                let distance = this.distance(point, c)
                if (first_distance) {
                    closer_distance = Math.abs(distance)
                    closer_cluster = c
                    first_distance = !first_distance
                } else {
                    if (Math.abs(distance) < closer_distance) {
                        closer_distance = Math.abs(distance)
                        closer_cluster = c
                    }

                }
                distances.push([point, c, distance])


            })
            clustered_data.push([point, closer_cluster, closer_distance])
        });


        return clustered_data

    }

    

    distance(point_a, point_b) {
        return point_b - point_a
    }



}