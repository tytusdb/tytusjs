class G8_Kmeans {
    constructor(params) {
        this.canvas = params.canvas;
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        //cantidad de clusters
        this.k = params.k;
        //Lista de puntos [[x1, y1],[x2, y2],[x3, y3]...[xn, yn]]
        this.data = params.data;
        
        //Control del cluster al que pertenece cada punto. 
        this.assignments = [];

        // Obtener las distancias (min,max) de las dimensiones.
        this.extents = this.dataDimensionExtents();

        // Obtener el rango de las dimensiones.
        this.ranges = this.dataExtentRanges();
        
        // Generar puntos de centroide random.
        this.means = this.seeds();

        // Colores para cada cluster.
        this.clusterColors = this.clusterColors();

        // Iteraciones en las que se mueve el centroide 
        this.iterations = 0;

        // Limpiar el canvas.
        this.context.fillStyle = 'rgb(255,255,255)';
        this.context.fillRect(0, 0, this.width, this.height);

        // Dibujar el canvas.
        this.draw();

        // Delay para cada iteración. (Es para que sea observable el movimiento de los centroides)
        this.drawDelay = 20;

        // Ejecutar algoritmo 
        this.run();

    }

    
    dataDimensionExtents() {
        var extents = [];
        for (var i = 0; i < this.data.length; i++) {
          var point = this.data[i];
      
          for (var j = 0; j < point.length; j++) {
            if (!extents[j]) {
              extents[j] = {min: 1000, max: 0};
            }
      
            if (point[j] < extents[j].min) {
              extents[j].min = point[j];
            }
      
            if (point[j] > extents[j].max) {
              extents[j].max = point[j];
            }
          }
        }     
        return extents;
      }
      
      dataExtentRanges () {
        var ranges = [];
      
        for (var i = 0; i < this.extents.length; i++) {
          ranges[i] = this.extents[i].max - this.extents[i].min;
        }
      
        return ranges;
      }

      seeds() {
        var means = [];
        while (this.k--) {
          var mean = [];
      
          for (var i = 0; i < this.extents.length; i++) {
            mean[i] = this.extents[i].min + (Math.random() * this.ranges[i]);
          }
      
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
      
            /* Calculamos una distancia euclidiana.
             * √((pi-qi)^2+...+(pn-qn)^2)
             */
      
            for (var dim = 0; dim < point.length; dim++) {
              // dif = (pn - qn)
              var difference = point[dim] - mean[dim];
      
              // dif = (dif)^2
              difference = Math.pow(difference, 2);
      
              // sum = (difi) + ... + (difn)
              sum += difference;
            }
      
            // √sum
            distances[j] = Math.sqrt(sum);
          }
      
          // Despues de calcular las distancias de cada punto a cada centroide
          // Escogemos las distancias más pequeñas.
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
      
        // Limpiar las distancias de cada dimension.
        for (i = 0; i < this.means.length; i++) {
          sums[i] = this.fillArray(this.means[i].length, 0);
        }
        for (var pointIndex = 0; pointIndex < this.assignments.length; pointIndex++) {
          meanIndex = this.assignments[pointIndex];
          var point = this.data[pointIndex];
          var mean = this.means[meanIndex];
      
          counts[meanIndex]++;
      
          for (dim = 0; dim < mean.length; dim++) {
            sums[meanIndex][dim] += point[dim];
          }
        }
      
        /* Si el centroide del cluster (mean) ya no se asigna a ningun punto 
         * Se debe mover a un lugar random en el rango de los puntos.
         */
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
      
        /* Si las "Means" actuales no son iguales que las nuevas, 
        * Se debe mover el centroide a un punto intermedio. 
         */
        if (this.means.toString() !== sums.toString()) {
          var diff;
          moved = true;
      
          // Nudge means 1/nth of the way toward average point.
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
      
        // Reasigna los puntos a su centroide más cercano .
        this.assignments = this.assignClusterToDataPoints();
      
        // Retorna true si los centroides se movieron desde la iteracion anterior
        var meansMoved = this.moveMeans();
      
        /* 
        Si el los centroides se movieron se debe volver a correr la asignacion de los puntos a su nuevo cluster
         */
        if (meansMoved) {
          this.draw();
          this.timer = setTimeout(this.run.bind(this), this.drawDelay);
        } else {
          // De lo contrario La operacion terminó. 
          console.log('Iteration took for completion: ' + this.iterations);
        }
      };

      draw () {
    
    // Para dar el efecto del movimiento se debe limpiar levemente el canvas
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
      colors.push('#'+((Math.random()*(1<<24))|0).toString(16));
    }
  
    return colors;
  };
  
   clusterColor(n) {
    return this.clusterColors[n];
  };
  
   fillArray(length, val) {
    return Array.apply(null, Array(length)).map(function() { return val; });
  }
}