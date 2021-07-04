
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
