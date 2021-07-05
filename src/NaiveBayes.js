class NaiveBayes {
    constructor( ) {
      this.causes = []
    }


    insertCause(name, array){

        let valid_data = true;

        for (let index = 0; index < this.causes.length; index++) {
            if (this.causes[index][0] === name){
                valid_data = false;
                console.log("Naive Bayes - Error on insertCause: cause names must be unique");
                break;
            }
            if (this.causes[index][1].length != array.length){
                valid_data = false;
                console.log("Naive Bayes - Error on insertCause: all array lengths must be the same");
                break;
            }
        }

        if (valid_data){
            this.causes.push([name,array])
        }

    }


    predict(effect, events ){
        //effect = "effect_name";
        //events= [["name", value],["name", value],["name", value] ...]
        //P(e|c1,c2,c3...) = P(e) * Π P(cn|e)
        let effect_array = this.getCauseByName(effect);
        
        let effect_unique_tuple =[];
        let effect_unique_value=[]

        for (let index = 0; index < effect_array.length; index++) {
            if (!effect_unique_value.includes(effect_array[index])){
                effect_unique_tuple.push([effect_array[index],0]);
                effect_unique_value.push(effect_array[index]);
            }
        }
        //console.log(effect_unique_tuple);
        
        for (let i = 0; i < effect_unique_tuple.length; i++) {
            let effect_prob = this.getSimpleProbability([effect,effect_unique_tuple[i][0]]);
       
            for (let j = 0; j < events.length; j++) {
               let cond_prob = this.getConditionalProbability(events[j],[effect,effect_unique_tuple[i][0]]);
                effect_prob = effect_prob*cond_prob;
            }
            effect_unique_tuple[i][1] =effect_prob; 
        }
        //console.log(effect_unique_tuple);

        let maxprob = 0;
        let val ="nothing :("
        for (let x = 0; x < effect_unique_tuple.length; x++) {
           if (effect_unique_tuple[x][1] > maxprob){
               maxprob = effect_unique_tuple[x][1] ;
               val = effect_unique_tuple[x][0];
           } 
        }
        return [val,(maxprob*100)+"%"];

    }

    getSimpleProbability(event){
        //event = ["name", value] // Returns probability of finding "value" on cause "name"

        let cause_array = this.getCauseByName(event[0]);
        let ocurrences =0;
        for (let index = 0; index < cause_array.length; index++) {
            if (cause_array[index] == event[1]){
                ocurrences++;
            }
        }

        return ocurrences / cause_array.length ;

    }

    getConditionalProbability(eventA, eventB){
        //event = ["name", value]  // Returns probability of eventA occurring given that eventB occurs.

        let cause_A = this.getCauseByName(eventA[0]);
        let cause_B = this.getCauseByName(eventB[0]);

        let ocurrences = 0;
        let total_events = 0;
        for (let index = 0; index < cause_A.length; index++) {
           if (cause_B[index]==eventB[1]){
                total_events++;
               if (cause_A[index] == eventA[1]){
                   ocurrences++;
               }
           }          
        }

        return ocurrences / total_events;
    }

    getCauseByName(cause_name){
        for (let index = 0; index < this.causes.length; index++) {
            if (this.causes[index][0] == cause_name){
               return this.causes[index][1]
            }
        }
        return null
    }

}