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

    clusterize(k, data, iterations) {
        //console.log(iterations)
        let clusters_proposals = []
        this.data = data
        //console.log(k, data)

        for (let i = 0; i < iterations; i++) {
            let clusters = []


            //pendiente agregar iterations
            //let copy_data = [...this.data]
            for (let i = 0; i < k; i++) {
                let c = data[Math.floor(Math.random() * data.length)]
                while (clusters.findIndex(x => x === c) != -1) {
                    c = data[Math.floor(Math.random() * data.length)]
                }
                clusters.push(c)
            }

            clusters = clusters.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); })
            //console.log('Clusters: ', clusters)

            //distancias [punto,cluster,distancia]
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


            //calcular medias y varianza

            let previous_cluster_stats = []
            let total_variance = 0
            let cluster_stats = []
            do {
                previous_cluster_stats = cluster_stats
                cluster_stats = []
                total_variance = 0
                // [mean,variance]
                clusters.forEach((c, i) => {
                    let data = clustered_data.filter((cd) => cd[1] == c)
                    let data_points = data.map((dp) => dp[0])
                    cluster_stats.push(this.calculateMeanVariance(data_points))
                    total_variance += data_points[1]
                    clusters[i] = cluster_stats[i][0]
                });

                if (Number.isNaN(total_variance)) {
                    total_variance = 0
                }


                // Recalcular distancias y agrupaciones

                distances = []
                clustered_data = []
                closer_cluster = 0, closer_distance = 0, first_distance = true;
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

                //console.log(clusters)
                //console.table(clustered_data)
            } while (JSON.stringify(previous_cluster_stats) != JSON.stringify(cluster_stats))
            clusters_proposals.push([total_variance, clusters, clustered_data])
        }

        // Posibles clusters
        // console.log(clusters_proposals)

        clusters_proposals.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0); })
        //console.table(distances)


        return clusters_proposals[0][2]

    }



    distance(point_a, point_b) {
        return point_b - point_a
    }

    calculateMeanVariance(arr) {

        function getVariance(arr, mean) {
            return arr.reduce(function (pre, cur) {
                pre = pre + Math.pow((cur - mean), 2);
                return pre;
            }, 0)
        }

        var meanTot = arr.reduce(function (pre, cur) {
            return pre + cur;
        })

        var total = getVariance(arr, meanTot / arr.length);

        var res = {
            mean: meanTot / arr.length,
            variance: total / arr.length
        }


        return [res.mean, res.variance]
    }



}
class _2DKMeans extends KMeans {
    constructor() {
        super()
        this.data = []
    }

    clusterize(k, data, iterations) {

        let clusters_proposals = []
        this.data = data
        //console.log(k, data)

        for (let i = 0; i < iterations; i++) {
            let clusters = []


            //pendiente agregar iterations
            //let copy_data = [...this.data]
            for (let i = 0; i < k; i++) {
                let c = data[Math.floor(Math.random() * data.length)]
                while (clusters.findIndex(x => x === c) != -1) {
                    c = data[Math.floor(Math.random() * data.length)]
                }
                clusters.push(c)
            }

            //            clusters = clusters.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); })
            // console.log('Clusters: ', clusters)




            //distancias [punto,cluster,distancia]
            let distances = []
            let clustered_data = []
            let closer_cluster = [], closer_distance = 0, first_distance = true;

            data.forEach(point => {
                closer_cluster = [0], closer_distance = 0, first_distance = true;

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

            //console.log(clustered_data)



            //calcular medias y varianza

            let previous_cluster_stats = []
            let total_variance = 0
            let cluster_stats = []
            let limit = 0
            do {
                previous_cluster_stats = cluster_stats
                cluster_stats = []
                total_variance = 0
                // [mean,variance]
                clusters.forEach((c, i) => {
                    let data = clustered_data.filter((cd) => JSON.stringify(cd[1]) == JSON.stringify(c))
                    let data_points = data.map((dp) => dp[0])
                    cluster_stats.push([this.calculateMeanVariance(data_points.map(d => d[0])), this.calculateMeanVariance(data_points.map(d => d[1]))])
                    total_variance += data_points[1]
                    clusters[i] = cluster_stats[i][0]
                });

                if (Number.isNaN(total_variance)) {
                    total_variance = 0
                }

                //console.log(cluster_stats)
                //console.log(clusters)


                // Recalcular distancias y agrupaciones

                distances = []
                clustered_data = []
                closer_cluster = 0, closer_distance = 0, first_distance = true;
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

                //console.log(clusters)
                //console.table(clustered_data)
                limit++
            } while ((JSON.stringify(previous_cluster_stats) != JSON.stringify(cluster_stats)) && limit < iterations)
            clusters_proposals.push([total_variance, clusters, clustered_data])
        }

        // Posibles clusters
        // console.log(clusters_proposals)

        clusters_proposals.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0); })
        //console.table(distances)


        return clusters_proposals[0][2]
    }

    distance(point_a, point_b) {
        let x1 = point_a[0]
        let y1 = point_a[1]
        let x2 = point_b[0]
        let y2 = point_b[1]

        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
    }


    calculateMeanVariance(arr) {

        if (arr.length < 1)
            return [1000000, 1000000]

        function getVariance(arr, mean) {
            return arr.reduce(function (pre, cur) {
                pre = pre + Math.pow((cur - mean), 2);
                return pre;
            }, 0)
        }

        var meanTot = arr.reduce(function (pre, cur) {
            return pre + cur;
        })

        var total = getVariance(arr, meanTot / arr.length);

        var res = {
            mean: meanTot / arr.length,
            variance: total / arr.length
        }


        return [res.mean, res.variance]
    }


}