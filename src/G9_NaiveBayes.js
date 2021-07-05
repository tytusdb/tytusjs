//grupo 9 
var $data = require('./data');
//const HashMap = require('./HashMap');

function Iterator(arr){
  if(!(arr instanceof Array)){
    throw new Error('se necesita un arreglo!');
  }
  this.arr = arr;
  this.index = 0;
  this.length = arr.length;
}

Iterator.prototype.current = function() {
    let res = this.index-1;
  return this.arr[res];
}

Iterator.prototype.next = function(){
  this.index += 1;
  if(this.index > this.length || this.arr[this.index-1] === null){
    return false;
  }
  else{
    return true;
  }
}

function Evaluate(dato) {
  if(!(dato instanceof Array)){
    throw new Error('se necesita un arreglo!');
  }
  this._data = dato;
  this._train = new Array();
  this._test = new Array();
  this.sampling();
}

Evaluate.prototype.sampling = function(){
  var iter = new Iterator(this._data), i = 1;
  
  while(iter.next()){
    iter.current().push(i)
    iter.current().push(0);
    i++;
  }

  while(i !== 2){

    var rand_length = Math.ceil(Math.random() * 100);
    var rand_arr = new Array();
    
    for(var j = 0; j < rand_length; j++){
      var rand_index = Math.floor(Math.random() * 100);
      rand_arr.push(rand_index);
    }
    
    for(; j > 0; j--){
      var t = this._data[rand_arr[j-1]];
      t[t.length-1]++;
      this._data.splice[rand_arr[j], 1, t];
    }

    i--;
  }
}

Evaluate.prototype.result = function() {
  this._train = this._data.filter(function(arr){
    return arr[arr.length-1] > 44;
  });

  this._test = this._data.filter(function(arr){
    return arr[arr.length-1] <= 44;
  });
  
  this._train.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  
  this._test.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  
  return {
    train: this._train,
    test: this._test,
    trainLen: this._train.length,
    testLen: this._test.length
  }
}

Evaluate.prototype.getMatrix = function(model, testData) {
  var _data = testData.slice(0);
  if(typeof model !== 'object'){
    throw new Error('se necesita un modelo');
  };
  var _matrix = [[0,0],[0,0]];
  var iter = new Iterator(_data);
  while(iter.next()){
    var test = iter.current();
    var true_res = test.splice(test.length-1, 1)[0];
    var pred_res = model.predictClass(test);
    if(pred_res === 'YES' && true_res === 'YES'){
        _matrix[0][0]++;
    }else if(pred_res === 'YES' && true_res === 'NO'){
        _matrix[1][0]++;
    }else if(pred_res === 'NO' && true_res === 'YES'){
        _matrix[0][1]++;
    }else if(pred_res === 'NO' && true_res === 'NO'){
        _matrix[1][1]++;
    };
    test.push(true_res);
  }
  return _matrix;
}

Evaluate.prototype.calcRate = function(matrix){
  var tpr = matrix[0][0] / (matrix[0][0] + matrix[0][1]);
  var fpr = matrix[1][0] / (matrix[1][0] + matrix[1][1]);
  return [fpr.toFixed(2), tpr.toFixed(2)];
}

/* BAYES */
function Bayes($data){
  this._DATA = $data;
}

/**
   * Clasifica los datos de entrenamiento en categorías
   * @return HashMap <categoría, datos de entrenamiento de la categoría correspondiente>
*/

Bayes.prototype.dataOfClass = function(){
    var map = new HashMap();
    var t = [], c = '';
    var datas = this._DATA;

    if(!(datas instanceof Array)){
        return;
    }

    for(var i = 0; i < datas.length; i++){
      t = datas[i];
      c = t[t.length - 1];
      if(map.hasKey(c)){
        var ot = map.get(c);
        ot.push(t);
        map.put(c, ot);
      }
      else {
        var nt = [];
        nt.push(t);
        map.put(c, nt);
      }
    }
    return map;
}

/**
    * Predecir la categoría de datos de prueba
    * @param Array testT datos de prueba
    * @return String Categoría correspondiente de datos de prueba
*/

Bayes.prototype.predictClass = function(testT){
    var doc = dataOfClass();
    var maxP = 0, maxPIndex = -1;
    var classes = doc.keys();
    
    for(var i = 0; i < classes.length; i++){
        var c = classes[i];
        var d = doc.get(c);
        var pOfC = d.length / this._DATA.length;
        
        for(var j = 0; j < testT.length; j++){
            var pv = this.pOfV(d, testT[j], j);
            pOfC = pOfC * pv;
        }

        if(pOfC > maxP){
            maxP = pOfC;
            maxPIndex = i;
        }
    }

    if(maxPIndex === -1 || maxPIndex > doc.length){
        return 'No se puede clasificar';
    }

    return classes[maxPIndex];
}

Bayes.prototype.pOfV = function(d, value, index){
    var p = 0, count = 0, total = d.length, t = [];
    for(var i = 0; i < total; i++){
      if(d[i][index] === value)
        count++;
    }
    p = count / total;
    return p;
} 



/*
//to get the dataset  of information
let variablesEnvironment=[];
let ocurrencyEnvironment=[];
let test=[];

//simple bayes function
function simpleBayes(A,B,BA){
    let result=(BA*A)/(B)
    return result
}

// To generate Naive Bayes
//1. Generate the frequency table from dataset
function frequencyTable(aaa,bbb){
    test=[];
    for(var i=0;i<aaa.length;i++){
        test.push([aaa[i],bbb[i]]);
    }
    console.table(test);
    console.log(test);

   
}


  
//let frequencyTable=[][];

function inicio(){
    variablesEnvironment=["rainy","sunny","overcast","overcast","sunny","rainy","sunny","overcast","rainy","sunny","sunny","rainy","overcast","overcast"];
    ocurrencyEnvironment=["yes","yes","yes","yes","no","yes","yes","yes","no","no","yes","no","yes","yes"];
    //test.push([variablesEnvironment,ocurrencyEnvironment])
    frequencyTable(variablesEnvironment,ocurrencyEnvironment);
    
}
*/