var svmjs = (function(exports){

    var SVM = function(options) {
  }

  SVM.prototype = {

    train: function(data, labels, options) {      
      this.data = data;
      this.labels = labels;

      options = options || {};
      var C = options.C || 1.0; 
      var tol = options.tol || 1e-4; 
      var alphatol = options.alphatol || 1e-7; 
      var maxiter = options.maxiter || 10000;
      var numpasses = options.numpasses || 10;
      
      var kernel = linearKernel;
      this.kernelType = "linear";
      if("kernel" in options) {
        if(typeof options.kernel === "string") {
          if(options.kernel === "linear") { 
            this.kernelType = "linear"; 
            kernel = linearKernel; 
          }
          if(options.kernel === "rbf") { 
            var rbfSigma = options.rbfsigma || 0.5;
            this.rbfSigma = rbfSigma; 
            this.kernelType = "rbf";
            kernel = makeRbfKernel(rbfSigma);
          }
        } else {
          this.kernelType = "custom";
          kernel = options.kernel;
        }
      }

      this.kernel = kernel;
      this.N = data.length; var N = this.N;
      this.D = data[0].length; var D = this.D;
      this.alpha = zeros(N);
      this.b = 0.0;
      this.usew_ = false; 

      if (options.memoize) {
        this.kernelResults = new Array(N);
        for (var i=0;i<N;i++) {
          this.kernelResults[i] = new Array(N);
          for (var j=0;j<N;j++) {
            this.kernelResults[i][j] = kernel(data[i],data[j]);
          }
        }
      }

      var iter = 0;
      var passes = 0;
      while(passes < numpasses && iter < maxiter) {
        
        var alphaChanged = 0;
        for(var i=0;i<N;i++) {
        
          var Ei= this.marginOne(data[i]) - labels[i];
          if( (labels[i]*Ei < -tol && this.alpha[i] < C)
           || (labels[i]*Ei > tol && this.alpha[i] > 0) ){
            
            var j = i;
            while(j === i) j= randi(0, this.N);
            var Ej= this.marginOne(data[j]) - labels[j];
            
            ai= this.alpha[i];
            aj= this.alpha[j];
            var L = 0; var H = C;
            if(labels[i] === labels[j]) {
              L = Math.max(0, ai+aj-C);
              H = Math.min(C, ai+aj);
            } else {
              L = Math.max(0, aj-ai);
              H = Math.min(C, C+aj-ai);
            }
            
            if(Math.abs(L - H) < 1e-4) continue;

            var eta = 2*this.kernelResult(i,j) - this.kernelResult(i,i) - this.kernelResult(j,j);
            if(eta >= 0) continue;
            
            var newaj = aj - labels[j]*(Ei-Ej) / eta;
            if(newaj>H) newaj = H;
            if(newaj<L) newaj = L;
            if(Math.abs(aj - newaj) < 1e-4) continue; 
            this.alpha[j] = newaj;
            var newai = ai + labels[i]*labels[j]*(aj - newaj);
            this.alpha[i] = newai;
            
            var b1 = this.b - Ei - labels[i]*(newai-ai)*this.kernelResult(i,i)
                     - labels[j]*(newaj-aj)*this.kernelResult(i,j);
            var b2 = this.b - Ej - labels[i]*(newai-ai)*this.kernelResult(i,j)
                     - labels[j]*(newaj-aj)*this.kernelResult(j,j);
            this.b = 0.5*(b1+b2);
            if(newai > 0 && newai < C) this.b= b1;
            if(newaj > 0 && newaj < C) this.b= b2;
            
            alphaChanged++;
            
          } 
        } 
        
        iter++;
        if(alphaChanged == 0) passes++;
        else passes= 0;
        
      } 
      
      if(this.kernelType === "linear") {

        // compute weights and store them
        this.w = new Array(this.D);
        for(var j=0;j<this.D;j++) {
          var s= 0.0;
          for(var i=0;i<this.N;i++) {
            s+= this.alpha[i] * labels[i] * data[i][j];
          }
          this.w[j] = s;
          this.usew_ = true;
        }
      } else {
        var newdata = [];
        var newlabels = [];
        var newalpha = [];
        for(var i=0;i<this.N;i++) {
          if(this.alpha[i] > alphatol) {
            newdata.push(this.data[i]);
            newlabels.push(this.labels[i]);
            newalpha.push(this.alpha[i]);
          }
        }

        this.data = newdata;
        this.labels = newlabels;
        this.alpha = newalpha;
        this.N = this.data.length;
      }

      var trainstats = {};
      trainstats.iters= iter;
      return trainstats;
    }
