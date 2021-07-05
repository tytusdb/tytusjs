class Kmeans_G13 {
    constructor(options) {
        this.canvas = options.canvas;
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.k = options.k;
        this.data = options.data;
        this.assignments = [];
        this.extents = this.Dimensions();
        this.ranges = this.dataExtentRanges();
        this.means = this.seeds();
        this.clusterColors = this.clusterColors();
        this.iterations = options.iterations;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(0, 0, this.width, this.height);
        this.draw();
        this.drawDelay = 50;
        this.run();

    }

    
    Dimensions() {
        var extents = [];
        for (var i = 0; i < this.data.length; i++) {
          var point = this.data[i];
          for (var j = 0; j < point.length; j++) {
            if (!extents[j])  extents[j] = {min: 1000, max: 0};
            if (point[j] < extents[j].min)  extents[j].min = point[j];
            if (point[j] > extents[j].max)  extents[j].max = point[j];
          }
        }     
        return extents;
      }
      
    dataExtentRanges () {
        var ranges = [];
        for (var i = 0; i < this.extents.length; i++) { ranges[i] = this.extents[i].max - this.extents[i].min; }
        return ranges;
    }

    seeds() {
        var means = [];
        while (this.k--) {
          var mean = [];
          for (var i = 0; i < this.extents.length; i++) { mean[i] = this.extents[i].min + (Math.random() * this.ranges[i]);}
          means.push(mean);
        }
        return means;
    }

    assignClusterToDataPoints (){
        var assignments = [];
        for (var i = 0; i < this.data.length; i++) {
          var point = this.data[i];
          var distances = [];
          for (var j = 0; j < this.means.length; j++) {
            var mean = this.means[j];
            var sum = 0;
            for (var dim = 0; dim < point.length; dim++) {
              var difference = point[dim] - mean[dim];
              difference = Math.pow(difference, 2);
              sum += difference;
            }
            distances[j] = Math.sqrt(sum);
          }
          assignments[i] = distances.indexOf(Math.min.apply(null, distances));
        }
        return assignments;
    };

    moveMeans() {
        var sums = this.fillArray(this.means.length, 0);
        var counts = this.fillArray(this.means.length, 0);
        var moved = false;
        var i;
        var meanIndex;
        var dim;
        for (i = 0; i < this.means.length; i++) { sums[i] = this.fillArray(this.means[i].length, 0); }
        for (var pointIndex = 0; pointIndex < this.assignments.length; pointIndex++) {
          meanIndex = this.assignments[pointIndex];
          var point = this.data[pointIndex];
          var mean = this.means[meanIndex];
          counts[meanIndex]++;
          for (dim = 0; dim < mean.length; dim++) {
            sums[meanIndex][dim] += point[dim];
          }
        }
        for (meanIndex = 0; meanIndex < sums.length; meanIndex++) {
          if (0 === counts[meanIndex]) {
            sums[meanIndex] = this.means[meanIndex];
            for (dim = 0; dim < this.extents.length; dim++) {
              sums[meanIndex][dim] = this.extents[dim].min + (Math.random() * this.ranges[dim]);
            }
            continue;
          }
          for (dim = 0; dim < sums[meanIndex].length; dim++) {
            sums[meanIndex][dim] /= counts[meanIndex];
            sums[meanIndex][dim] = Math.round(100*sums[meanIndex][dim])/100;
          }
        }
        if (this.means.toString() !== sums.toString()) {
          var diff;
          moved = true;
          for (meanIndex = 0; meanIndex < sums.length; meanIndex++) {
            for (dim = 0; dim < sums[meanIndex].length; dim++) {
              diff = (sums[meanIndex][dim] - this.means[meanIndex][dim]);
              if (Math.abs(diff) > 0.1) {
                var stepsPerIteration = 10;
                this.means[meanIndex][dim] += diff / stepsPerIteration;
                this.means[meanIndex][dim] = Math.round(100*this.means[meanIndex][dim])/100;
              } else {
                this.means[meanIndex][dim] = sums[meanIndex][dim];
              }
            }
          }
        }
        return moved;
      }

    run () {
        ++this.iterations;
        this.assignments = this.assignClusterToDataPoints();
        var meansMoved = this.moveMeans();
        if (meansMoved) {
          this.draw();
          this.timer = setTimeout(this.run.bind(this), this.drawDelay);
        }
    };

    draw () {
        this.context.fillStyle = 'rgba(255,255,255, 0.2)';
        this.context.fillRect(0, 0, this.width, this.height);
    
        var point;
        var i;
    
        /* Se dibujan los puntos desde el punto al centroide. 
        */
        for (i = 0; i < this.assignments.length; i++) {
        var meanIndex = this.assignments[i];
        point = this.data[i];
        var mean = this.means[meanIndex];
    
        // Lineas dibujadas "alpha transparent".
        this.context.globalAlpha = 0.1;
    
        // Push al estado actual a la pila
        this.context.save();
    
        this.context.beginPath();
    
        // Empezar a trazar los puntos 
        this.context.moveTo(
            (point[0] - this.extents[0].min + 1) * (this.width / (this.ranges[0] + 2)),
            (point[1] - this.extents[1].min + 1) * (this.height / (this.ranges[1] + 2))
        );
    
        // Dibujar linea hacia el centroide.
        this.context.lineTo(
            (mean[0] - this.extents[0].min + 1) * (this.width / (this.ranges[0] + 2)),
            (mean[1] - this.extents[1].min + 1) * (this.height / (this.ranges[1] + 2))
        );
    
        this.context.strokeStyle = 'black';
        this.context.stroke();
        //this.context.closePath();
    
        // Restore saved state.
        this.context.restore();
        }
    
        // Plot every point onto canvas.
        for (i = 0; i < data.length; i++) {
        this.context.save();
    
        point = this.data[i];
    
        // Opacar
        this.context.globalAlpha = 1;
    
        //mover el origen hacia el punto actual de la posicon 
        this.context.translate(
            (point[0] - this.extents[0].min + 1) * (this.width / (this.ranges[0] + 2)),
            (point[1] - this.extents[1].min + 1) * (this.width / (this.ranges[1] + 2))
        );
    
        this.context.beginPath();
        this.context.arc(0, 0, 5, 0, Math.PI*2, true);
    
        //Color basado en en el color del centroide al que pertenece 
        
        this.context.strokeStyle = this.clusterColor(this.assignments[i]);
    
        this.context.stroke();
        this.context.closePath();
    
        this.context.restore();
        }
    
        //Dibujar los centroides
        for (i = 0; i < this.means.length; i++) {
        this.context.save();
    
        point = this.means[i];
    
        this.context.globalAlpha = 0.5;
        this.context.fillStyle = this.clusterColor(i);
        this.context.translate(
            (point[0] - this.extents[0].min + 1) * (this.width / (this.ranges[0] + 2)),
            (point[1] - this.extents[1].min + 1) * (this.width / (this.ranges[1] + 2))
        );
        this.context.beginPath();
        this.context.arc(0, 0, 5, 0, Math.PI*2, true);
        this.context.fill();
        this.context.closePath();
    
        this.context.restore();
        }
  };
  
//Genera colores random para cada cluster
    clusterColors() {
        var colors = [];
        for (var i = 0; i < this.data.length; i++) {
        colors.push('#'+((Math.random()*(1<<24))|0).toString(16));}
        return colors;
    };
  
   clusterColor(n) { return this.clusterColors[n]; };
   fillArray(length, val) { return Array.apply(null, Array(length)).map(function() { return val; }); }
}