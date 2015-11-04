(function(Brain) {
	"use strict";

	function NeuralNet(params) {
		this.bias = params.bias;
		this.inputCount = params.inputCount;
		this.outputCount = params.outputCount;
		this.hiddenLayerCount = params.hiddenLayerCount;
		this.activationResponse = params.activationResponse;
		this.hiddenLayerNeuronCount = params.hiddenLayerNeuronCount;

		this.layers = [];

		this.createNet();
	}

	NeuralNet.prototype = {
		/**
		 * this method builds the ANN. The weights are all initially set to
		 * random values -1 < w < 1
		 */
		createNet: function() {
			var max = this.hiddenLayerCount - 1,
					i = 0;

			//create the layers of the network
			if (this.hiddenLayerCount > 0) {
				//create first hidden layer
				this.layers.push(
						new Brain.NeuronLayer(this.hiddenLayerNeuronCount, this.inputCount));
				for (; i < max; i++) {
					this.layers.push(
							new Brain.NeuronLayer(this.hiddenLayerNeuronCount, this.hiddenLayerNeuronCount));
				}

				//create output layer
				this.layers.push(
						new Brain.NeuronLayer(this.outputCount, this.hiddenLayerNeuronCount));
			} else {
				//create output layer
				this.layers.push(
						new Brain.NeuronLayer(this.outputCount, this.inputCount));
			}
		},

		/**
		 * returns a vector containing the weights
		 * @returns {Array}
		 */
		getWeights: function() {
			var weights = [],
				layer,
				neuron,
				i,
				j,
				k;

			//for each layer
			for (i = 0; i <= this.hiddenLayerCount; i++) {
				layer = this.layers[i];

				//for each neuron
				for (j = 0; j < layer.neurons.length; j++) {
					neuron = layer.neurons[j];

					//for each weight
					for (k = 0; k < neuron.weights.length; k++) {
						weights.push(neuron.weights[k]);
					}
				}
			}
			return weights;
		},

		/**
		 * given a vector of doubles this function replaces the weights in the NN
		 * with the new values
		 * @param weights
		 */
		putWeights: function(weights) {

			var cWeight = 0,
				layer,
				neuron,
				i,
				j,
				k;

			//for each layer
			for (i = 0; i <= this.hiddenLayerCount; i++) {
				layer = this.layers[i];

				//for each neuron
				for (j = 0; j < layer.neurons.length; j++) {
					neuron = layer.neurons[j];

					//for each weight
					for (k = 0; k < neuron.weights.length; k++) {
						neuron.weights[k] = weights[cWeight++];
					}
				}
			}
		},

		/**
		 * returns the total number of weights needed for the net
		 * @returns {number}
		 */
		getNumWeights: function() {
			var weights = 0,
				layer,
				neuron,
				i,
				j,
				k;

			//for each layer
			for (i = 0; i < this.layers.length; i++) {
				layer = this.layers[i];

				//for each neuron
				for (j = 0; j < layer.neurons.length; j++) {
					neuron = layer.neurons[j];

					//for each weight
					for (k = 0; k < neuron.weights.length; k++) {
						weights++;
					}
				}
			}

			return weights;
		},

		//run the neural network and get outputs
		update: function(inputs) {
			//stores the resultant outputs from each layer
			var outputs = [],
				layer,
				neurons,
				neuron,
				weight = 0,
				netInput,
				inputCount,
				i,
				j,
				k;

			//first check that we have the correct amount of inputs
			if (inputs.length != this.inputCount) {
				//just return an empty vector if incorrect.
				return outputs;
			}

			//For each layer....
			for (i = 0; i <= this.hiddenLayerCount; i++) {
				layer = this.layers[i];
				neurons = layer.neurons;
				//After the first layer, the inputs get set to the output of previous layer
				if (i > 0) {
					//we clone the output so it isn't cleared after this step
					inputs = outputs.slice(0);
				}

				while(outputs.length > 0) {outputs.pop()}

				weight = 0;

				/*
				for each neuron sum the (inputs * corresponding weights).Throw
				the total at our sigmoid function to get the output
				*/
				for (j = 0; j < neurons.length; j++) {
					neuron = neurons[j];
          netInput = 0;

					inputCount = neuron.weights.length * 1;

					//for each weight
					for (k = 0; k < inputCount - 1; k++) {

						//sum the weights x inputs
            netInput += neuron.weights[k] * inputs[weight++];
					}

					//add in the bias
          netInput += neuron.weights[inputCount - 1] * this.bias;

					/*
					we can store the outputs from each layer as we generate them.
					The combined activation is first filtered through the sigmoid
					function
					*/
					outputs.push(this.sigmoid(netInput, this.activationResponse));

					weight = 0;
				}
			}

			return outputs;
		},

		sigmoid: function(netInput, response) {
			return (1 / (1 + Math.exp(-netInput / response)));
		}
	};

	Brain.NeuralNet = NeuralNet;
})(Brain);