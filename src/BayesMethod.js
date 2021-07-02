class BayesMethod{

    constructor(){              
        this.attributes = []
        this.classes = []
        this.frecuencyTables = []      
        this.attributeClassProbabilities = []        
        this.attributeNames = []  
        this.className = null
    }

    addAttribute(values, attributeName = null){
        //check if attribute exists
        if (attributeName){
            if (this.attributeNames.includes(attributeName)){
                //attribute already added
                return false
            }
        }        

        if (values){
            //check if values is array
            if (!Array.isArray(values)){
                //values must be array
                return false
            }else{
                //check if values are primitive
                let primitiveValues = true
                values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))

                if (!primitiveValues){
                    return false
                }                    
            }

            this.attributes = this.attributes.concat(values)
            if (attributeName){
                this.attributeNames.push(attributeName)
            }            
        }        
        return true
    }

    addClass(values, className = null){        
        if (this.class){
            //there's already a class defined (just one is allowed)
            return false
        }
        if (values){
            //check if values is array
            if (!Array.isArray(values)){
                //values must be array
                return false
            }else{
                //check if values are primitive
                let primitiveValues = true
                values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))
                
                if (!primitiveValues){
                    return false
                }
            }

            this.classes = this.classes.concat(values)

            if (className){
                this.className.push(className)
            }
        }        
        return true
    }

    train(){
        if (this.isModelValid()){
            return false
        }

        // create frecuency table for each attribute
        this.attributes.forEach(attribs, i => {
            let frecuencyTable = this.toFrecuencyTable(attribs)
            if (frecuencyTable){
                this.frecuencyTables.push(frecuencyTable)                                                
            }
        })

        //last frecuency table will have the probabilities of each class
        this.frecuencyTables.push(this.toFrecuencyTable(this.classes))
        
        
        // for each attribute calculate its probability for each class P(attribute|class)
        this.attributes.forEach(attribs, i => {
            let attributeFrecuencyTable = this.frecuencyTables[i]
            let classFrecuencyTable = this.frecuencyTables[this.frecuencyTables.length - 1]
            
            var valueClassProbabilities = []
            attributeFrecuencyTable.values.forEach(value, j => {
                var classProbabilities = []
                classFrecuencyTable.values.forEach(_class, k => {
                    classProbabilities.push(0)
                    attribs.forEach(a, i => {
                        if (a == value && this.classes[i] == _class){
                            classProbabilities[classProbabilities.length - 1] += 1
                        }
                    })
                    classProbabilities[classProbabilities.length - 1] = classProbabilities[classProbabilities.length - 1] / attributeFrecuencyTable.frecuencies[j]                    
                })

                valueClassProbabilities.push(classProbabilities);
            })

            attributeFrecuencyTable.valueClassProbabilities = valueClassProbabilities;
        })
        return true
    }

    predictClass(attributes){
        
    }


    isModelValid(){
        if (!this.classes){
            //classes needed
            return false
        }
        if (!this.attributes){
            //attributes needed
            return false
        }
        return true
    }

    toFrecuencyTable(values){
        if (!Array.isArray(values)){
            //values must be array
            return false
        }else{
            //check if values are primitive
            let primitiveValues = true
            values.forEach(v => primitiveValues = primitiveValues && v !== Object(v))
            
            if (!primitiveValues){
                return false
            }
        }

        var distinctValues = []
        var frecuencies = []
        var probabilities = []

        this.values.forEach(v, i => {            
            var foundIndex = distinctValues.findIndex(v)
            if (foundIndex > -1){
                frecuencies[foundIndex] += 1
            }else{
                distinctValues.push(v)
                frecuencies.push(1)
            }
        })

        frecuencies.forEach(f => probabilities.push(f/frecuencies.length))

        let frecuencyTable = {
            values: distinctValues,
            frecuencies: frecuencies,
            probabilities: probabilities
        }

        return frecuencyTable
    }
}