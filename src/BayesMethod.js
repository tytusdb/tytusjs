/*
The Naive Bayes classifier is a pretty popular text classification algorithm because of it’s simplicity.
The Naive Bayes classifier takes in a corpus (body of text) known as a document, 
which then a stemmer runs through the document and returns a “bag or words” so to speak. 
Stemming is the process of reducing an inflected word to it’s word stem (root).
*/
class BayesMethod{

    constructor(){              
        this.attributes = []
        this.classes = []
        this.frecuencyTables = []                      
        this.attributeNames = []  
        this.className = null
    }
    /*
    this method checks if the attribute is valid, if is valid then its pushed to an array
    */
    addAttribute(values, attributeName){
        //check if attribute exists
        if (attributeName){
            if (this.attributeNames.includes(attributeName)){
                //attribute already added
                throw Exception('Attribute already added')
            }
        }        

        if (values){
            //check if values is array
            if (!Array.isArray(values)){
                //values must be array
                throw Exception('Value must be array')
            }else{
                //check if values are primitive
                let primitiveValues = true
                values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))

                if (!primitiveValues){
                    throw Exception('Value is not primivite')
                }                    
            }

            this.attributes.push(values)
            if (attributeName){
                this.attributeNames.push(attributeName)
            }            
        }        
        return true
    }
    /*
    this method cheks if there is a valid class to asign the values
    */
    addClass(values, className){        
        if (this.class){
            //there's already a class defined (just one is allowed)
            throw Exception('There is already a class defined')
        }
        if (values){
            //check if values is array
            if (!Array.isArray(values)){
                //values must be array
                throw Exception('Values must be array')
            }else{
                //check if values are primitive
                let primitiveValues = true
                values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))
                
                if (!primitiveValues){
                    throw Exception('value is not primitive')
                }
            }

            this.classes = values

            if (className){
                this.className = className
            }
        }        
        return true
    }
    /*
    this is the train method, with this we train our model to calculete its probability for each atribute and each class
    */
    train(){
        if (!this.isModelValid()){
            throw Exception('Model not valid')
        }

        // create frecuency table for each attribute
        this.attributes.forEach((attribs, i) => {
            //console.log(attribs)
            let frecuencyTable = this.toFrecuencyTable(attribs)
            if (frecuencyTable){
                this.frecuencyTables.push(frecuencyTable)                                                
            }
            //console.log(frecuencyTable)
        })

        //last frecuency table will have the probabilities of each class
        var classFrecuencyTable = this.toFrecuencyTable(this.classes)
        this.frecuencyTables.push(classFrecuencyTable)
        //console.log(this.frecuencyTables)
        
        
        // for each attribute calculate its probability for each class P(attribute|class)
        this.attributes.forEach((attribs, i) => {
            let attributeFrecuencyTable = this.frecuencyTables[i]
            
            var valueClassProbabilities = []
            attributeFrecuencyTable.values.forEach((value, j) => {
                var classProbabilities = []
                classFrecuencyTable.values.forEach((_class, k) => {
                    classProbabilities.push(0)
                    attribs.forEach((a, i) => {
                        if (a == value && this.classes[i] == _class){
                            classProbabilities[classProbabilities.length - 1] += 1
                        }
                    })
                    classProbabilities[classProbabilities.length - 1] = classProbabilities[classProbabilities.length - 1] / attributeFrecuencyTable.frecuencies[j]                    
                })

                valueClassProbabilities.push(classProbabilities);
            })

            attributeFrecuencyTable.valueClassProbabilities = valueClassProbabilities;
            //console.log(attributeFrecuencyTable)
        })
        return true
    }
    /*
    here we get the actual probability in a numeric value
    */
    probability(attributeName, cause, effect){
        
        var attribIndex = this.attributeNames.findIndex(n => n === attributeName)
        if (attribIndex == -1){
            throw Exception('attribute index -1')
        }

        var frecuencyTable = this.frecuencyTables[attribIndex]
        var causeIndex = frecuencyTable.values.findIndex(v => v == cause)

        if (causeIndex == -1){
            throw Exception('cause index -1')
        }

        var classFrecuencyTable = this.frecuencyTables[this.frecuencyTables.length - 1]
        var effectIndex = classFrecuencyTable.values.findIndex(v => v == effect)
        //P(C|E) = P(E|C) * P(C) / P(E)
        var P_E_C = frecuencyTable.valueClassProbabilities[causeIndex][effectIndex]
        var P_C = frecuencyTable.probabilities[causeIndex]
        var P_E = classFrecuencyTable.probabilities[effectIndex]

        return P_E_C * P_C / P_E
    }
    /*
    This is the predict methos, for the cause sequence provided calculate its probability for each class
    */
    predict(causes, effect = null){
        var classProbabilities = [];
        var classFrecuencyTable = this.frecuencyTables[this.frecuencyTables.length - 1]
        
        var _classes = classFrecuencyTable.values
        
        
        _classes.forEach((_class, i) => {
            //calculate P(E|C1, C2, ... Cn) =  P(E) * Multiplicatory(P(C1|E))
            
            var P_E = classFrecuencyTable.probabilities[i]
            var Multiplicatory = 1
            causes.forEach((c, j) => {
                if (c != null){
                    //calculate P(Cn|E) = P(E|Cn) * P(Cn) / P(E)
                    var P_Cn_E = this.probability(this.attributeNames[j], c, _class)
                    //console.log(`(${this.attributeNames[j]}) P(${c}|${_class})`)
                    //console.log(P_Cn_E)
                    if (P_Cn_E != null){
                        Multiplicatory *= P_Cn_E
                    }
                    
                }
            })
            classProbabilities.push(P_E * Multiplicatory)
        })

        if (effect != null){
            var effectIndex = classFrecuencyTable.values.findIndex(v => v === effect)
            if (effectIndex == -1){
                return [effect, null]
            }
            return [effect, classProbabilities[effectIndex]];
        }else if (classProbabilities.length > 1){
            //return the class with the highest probability
            var highestProbabilityClassIndex = 0
            var highestProbability = classProbabilities[0]
            classProbabilities.forEach((p, i) => { 
                if (p > highestProbability){
                    highestProbabilityClassIndex = i
                    highestProbability = p
                }
            });
            return [this.classes[highestProbabilityClassIndex], highestProbability]
        }else{
            throw Exception('class probabilities < 1')
        }
    }

    /*
    this verify if there is a valid model then returns true if is valid
    */
    isModelValid(){
        if (!this.classes){
            //classes needed
            throw Exception('classes needed')
        }
        if (!this.attributes){
            //attributes needed
            throw Exception('atributes needed')
        }else{
            let length = this.attributes[0].length;
            let sameLength = true;
            this.attributes.forEach(values => sameLength = sameLength && values.length == length)
            sameLength = sameLength && this.classes.length;

            if (!sameLength){
                console.log('attributes and class must have the same ammount of elements')
                throw Exception('attributes and class must have the same ammount of elements')
            }
        }
        return true
    }
    /*
    this transforns the values of each class into a frecuency table.
    */
    toFrecuencyTable(values){
        if (!Array.isArray(values)){
            //values must be array
            throw Exception('values must be array')
        }else{
            //check if values are primitive
            let primitiveValues = true
            values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))
            
            if (!primitiveValues){
                throw Exception('value not primitive')
            }
        }

        var distinctValues = []
        var frecuencies = []
        var probabilities = []

        values.forEach((v, i) => { 
                     
            var foundIndex = distinctValues.findIndex(val => val === v)
            if (foundIndex > -1){
                frecuencies[foundIndex] += 1
            }else{
                distinctValues.push(v)
                frecuencies.push(1)
            }
        })

        frecuencies.forEach(f => probabilities.push(f/values.length))

        let frecuencyTable = {
            values: distinctValues,
            frecuencies: frecuencies,
            probabilities: probabilities
        }

        return frecuencyTable
    }
}