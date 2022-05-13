class NeuralNetwork {
    constructor(nueronCounts) {
        this.levels = [];
        
        for(let i = 0; i < nueronCounts.length-1; i++) {
            this.levels.push(new Level(
                nueronCounts[i], nueronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs,
            network.levels[0]
        );

        for(let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(    
                outputs, 
                network.levels[i]
            );
        }

        return outputs;
    }

    static mutate(network, ammount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    ammount
                );
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        ammount
                    );
                }
            }
        });
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) 
            this.weights[i] = new Array(outputCount);
        
        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) 
            for(let j = 0; j < level.outputs.length; j++)
                level.weights[i][j] = Math.random()*2 - 1;

        for(let i = 0; i < level.biases.length; i++)
            level.biases[i] = Math.random()*2 - 1;
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) 
            level.inputs[i] = givenInputs[i];
        
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for(let j = 0; j < level.inputs.length; j++)
                sum += level.inputs[j] * level.weights[j][i];
            
            level.outputs[i] = (sum > level.biases[i])? 1: 0;
        }

        return level.outputs
    }
}