class NodeTree {
    constructor(_value = null, _tag="", _childs = []){
        this.id = Math.random().toString(15).substr(3,12);
        this.tag = _tag;
        this.value = _value;
        this.childs = _childs;
    }
}

class Feature {
    constructor(_attribute, _primaryPosibility, _secondPosibility){
        this.attribute = _attribute;
        this.entropy = -1;
        this.gain = -1;
        this.primaryCount = 0;
        this.secondaryCount = 0;
        this.primaryPosibility = _primaryPosibility;
        this.secondPosibility = _secondPosibility;
    }

    updateFeature(_posibility){
        if(_posibility === this.primaryPosibility){
            this.primaryCount += 1;
        }else if(_posibility === this.secondPosibility) {
            this.secondaryCount += 1;
        }else {
            //error
            return false;
        }
        this.entropy = this.calculateEntropy(this.primaryCount, this.secondaryCount);
        return true;
    }

    calculateEntropy(_p, _n) {
        let entropy = -1;
        if(_p == 0 || _n == 0){
            return 0;
        }
        entropy = -(_p/(_p+_n))*Math.log2(_p/(_p+_n))
        entropy += -(_n/(_p+_n))*Math.log2(_n/(_p+_n))
        return entropy;
    }
}

class Attribute {
    constructor(_attribute){
        this.attribute = _attribute;
        this.features = [];
        this.infoEntropy = -1;
        this.gain = -1;
        this.index = -1;
    }
}
/**
 * Generate a object to this class and call function train
 */
class DecisionTreeID3 {
    constructor(_dataSet = []) {
        this.dataset = _dataSet
        this.generalEntropy = -1;
        this.primaryCount = -1;
        this.secondaryCount = -1;
        this.primaryPosibility = "";
        this.secondPosibility = "";
        this.root = null;
    }

    /**
     * 
     * @param {Number} _p 
     * @param {Number} _n 
     * @returns {Number}
     */
    calculateEntropy(_p, _n) {
        let entropy = -1;
        if(_p == 0 || _n == 0){
            return 0;
        }
        entropy = -(_p/(_p+_n))*Math.log2(_p/(_p+_n))
        entropy += -(_n/(_p+_n))*Math.log2(_n/(_p+_n))
        return entropy;
    }

    /**
     * This funcition only acept:
     *      - The data set is a matrix and contain the header
     *      - The result column must be in the matrix last column
     * this funcition return the root of the tree generated
     * @param {any[]} _dataset 
     * @param {Integer} _start 
     * @returns {NodeTree}
     */
    train(_dataset, _start = 0){
        // We going to train the algorithm
        // First we going to calculate entropy of data set
        let columnResult = _dataset[0].length - 1;
        this.calculateGeneralEntropy(_dataset, columnResult);

        /**
         * Second we going to classifier every feature and calculate the entropy of every feature inside of data set
         * This process is realized for every Attribute
         * */
        let numberAttributes = _dataset[0].length;
        let gainAttribute = []
        for (let i = _start ; i< numberAttributes; i++){
            if(i === columnResult) continue;
            let attribute = new Attribute(_dataset[0][i]);
            attribute.index = i;
            attribute.features = this.classifierFeatures(_dataset, i, columnResult);
            attribute.infoEntropy = this.calculateInformationEntropy(attribute.features);
            attribute.gain = this.calculateGain(this.generalEntropy, attribute.infoEntropy);
            gainAttribute.push(attribute);
        }
        if(gainAttribute.length == 0){
            return null;
        }
        /**
         * Third we going to select the best attribute
         */
        let selectedGain = this.selectBestFeature(gainAttribute);
        
        /**
         * We going to create a node with the best attribute selected
         */
        
        let parentNode = new NodeTree(gainAttribute[selectedGain].attribute);
        gainAttribute[selectedGain].features.map(feat => {
            let childNode = new NodeTree(null);
            if(feat.entropy == 0){
                childNode.value = feat.primaryCount == 0 ? feat.secondPosibility : feat.primaryPosibility;
            }else {
                let newDataSet = _dataset.filter((split, index) => (split[gainAttribute[selectedGain].index] === feat.attribute) || index == 0)
                if(_start < 4 && newDataSet.length >2) childNode = this.train(newDataSet, _start+1);
            }
            childNode.tag = feat.attribute;
            parentNode.childs.push(childNode);
        });
        return parentNode;
        
    }

    /**
     * Simple function to predict a data
     * @param {any[]} _predict 
     * @param {NodeTree} _root 
     * @returns 
     */
    predict(_predict, _root){
        return this.recursivePredict(_predict, _root);
    }

    /**
     * Simple function
     * @param {any[]} _predict 
     * @param {NodeTree} _node 
     * @returns 
     */
    recursivePredict(_predict,_node){
        if(_node.childs.length == 0) return _node;
        for (let index = 0; index<_predict[0].length; index++){
            if(_predict[0][index] === _node.value){
                //if(this.childs.length == 0) return
                for(let i = 0; i<_node.childs.length; i++){
                    if(_node.childs[i].tag === _predict[1][index]){
                        return this.recursivePredict(_predict, _node.childs[i])
                    }
                }
            }
        }
        return null;
    }

    /**
     * 
     * @param {String Array} _dataset 
     * @param {Integer} indexResult this attribute is to indicate the result column in the data set
     * @returns {Float}
     */
    calculateGeneralEntropy(_dataset, indexResult){
        let att1 = {
            tag: "",
            count: 0
        }
        let att2 = {
            tag: "",
            count: 0
        }
        let header = false;
        _dataset.map(f => {
            if (header){
                if(!att1.tag){
                    att1.tag = f[indexResult];
                    att1.count += 1;
                }else if(!att2.tag && f[indexResult] != att1.tag) {
                    att2.tag = f[indexResult];
                    att2.count += 1;
                }else if(att1.tag === f[indexResult]){
                    att1.count += 1;
                }else if(att2.tag === f[indexResult]){
                    att2.count += 1;
                }
            }else {
                header = true;
            }
            
        });
        this.primaryPosibility = att1.tag;
        this.secondPosibility = att2.tag;
        this.primaryCount = att1.count;
        this.secondaryCount = att2.count;
        this.generalEntropy = this.calculateEntropy(att1.count,att2.count);
        return this.generalEntropy;
    }

    /**
     * 
     * @param {string[]} _dataset 
     * @param {Integer} indexFeature 
     * @param {Integer} indexResult 
     * @returns 
     */
    classifierFeatures(_dataset, indexFeature, indexResult){
        let features = []
        let header = false;
        _dataset.map(f => {
            if(header) {
                let index = features.findIndex(t => t.attribute === f[indexFeature]);
                if(index > -1){
                    features[index].updateFeature(f[indexResult]);
                }else {
                    let feat = new Feature(f[indexFeature], this.primaryPosibility, this.secondPosibility);
                    feat.updateFeature(f[indexResult]);
                    features.push(feat);
                }
            }else {
                header = true;
            }
        });
        return features;
    }

    /**
     * 
     * @param {Feature[]} _features 
     * @returns {Number}
     */
    calculateInformationEntropy(_features) {
        let infoEntropy = 0;
        _features.map(f => {
            infoEntropy += ((f.primaryCount+f.secondaryCount)/(this.primaryCount+ this.secondaryCount))*f.entropy;
        })
        return infoEntropy;
    }

    /**
     * 
     * @param {Number} _generalEntropy 
     * @param {Number} _infoEntropy 
     * @returns {Number}
     */
    calculateGain(_generalEntropy, _infoEntropy){
        let gain = _generalEntropy - _infoEntropy;
        return gain;
    }

    /**
     * Select the best Attribute with the max gain factor and return the index of the feature selected.
     * @param {Attribute[]} _attributes 
     * @returns {Integer}
     */
    selectBestFeature(_attributes){
        let index = -1;
        let best = -1000;
        _attributes.map((feature,indexFeature) => {
            if (feature.gain > best){
                best = feature.gain;
                index = indexFeature;
            }

        })
        return index
    }

    /**
     * this function is for create a string with the dot structure to create the graphic tree.
     * @param {NodeTree} _root 
     * @returns {string}
     */
    generateDotString(_root){
        let dotStr = "{";
        dotStr += this.recursiveDotString(_root);
        dotStr += "}";
        return dotStr;
    }

    /**
     * this function is for travel the tree structure.
     * @param {NodeTree} _root 
     * @param {string} _idParent 
     * @returns {string}
     */
    recursiveDotString(_root, _idParent = ""){
        let dotStr = "";
        if(!_root) return "";
        dotStr += `${_root.id} [label="${_root.value}"];`;
        dotStr += _idParent? `${_idParent}--${_root.id}` : "";
        dotStr += _root.tag? `[label="${_root.tag}"];` : "";
        _root.childs.map(child => {
            dotStr += this.recursiveDotString(child,_root.id);
        });
        return dotStr;
    }
}