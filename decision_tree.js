/** Gera uma árvode de decisão selecionando
  * como raiz o atributo que obtem o melhor
  * ganho de informação. */
(function(){
	var count = 0; // TEMP simulação de seleção de atributo
	var aaa = 0;


	var input = [
		{ A: 1, B: 1, C: 1, target: true, },
		{ A: 1, B: 1, C: 2, target: false, },
		{ A: 1, B: 1, C: 1, target: false, },
		{ A: 1, B: 2, C: 2, target: true, },
		{ A: 1, B: 2, C: 2, target: false, },
		{ A: 2, B: 1, C: 1, target: false, },
		{ A: 2, B: 1, C: 1, target: false, },
		{ A: 2, B: 1, C: 3, target: true, },
		{ A: 2, B: 2, C: 3, target: true, },
		{ A: 2, B: 2, C: 3, target: true, },
	];

	var attribute_list = get_attribute_list(input);
	var root_node = build_tree(input);
		
	print_tree(root_node);

	///// 

	function build_tree(data) {
		let attr = get_best_attribute(data);
		if(attr) {
			/* Dados ainda podem ser segmentados */

			// Conta quantidade de classes distintas nos dados
			let distinct_class = data.map(d => d.target).filter(function onlyUnique(value, index, self) { 
			    return self.indexOf(value) === index;
			}).length;

			if(distinct_class === 1) {
				/* "conjunto puro" */
				return data[0].target;
			} else {
				/* Separar dados conforme valores do atributo selecionado. */
				var node = {
					attr: attr,
					children: {},
				}
				// Agrupa dados por valor do atributo selecionado
				var children_data = {};
				for(let i = 0; i < data.length; i++) {
					let value = data[i][node.attr];
					if(children_data[value] === undefined) {
						children_data[value] = [];
					}
					children_data[value].push(data[i]);
				}

				// Cria/processa nodos filhos
				for(let value in children_data) {
					if(children_data.hasOwnProperty(value)) {
						// console.log("_".repeat(count-1) + node.attr, value, children_data[value].length)
						node.children[value] = build_tree(children_data[value]);
						count--;
					}
				}

				return node;

			}
		} else {
			/* Dados não podem ser segmentados.
			 * Usa classe mais frequente como representante do grupo. */

			// Conta classes distintas nos dados
			let class_count = {};
			for(let i = 0; i < data.length; i++) {
				if(class_count[data[i].target] === undefined) {
					class_count[data[i].target] = 0;
				}
				class_count[data[i].target]++;
			}

			// Seleciona mais frequente
			let max = { value: 0 };
			for(let i in class_count) {
				if(class_count[i] >= max.value) {
					max = {
						class: i,
						value: class_count[i],
					}
				}
			}
			
			return max.class;	
		}
	}

	function get_best_attribute(data) {
		let InfoD = get_data_entropy(data);
		let attrs = group_attributes_by_class(data);
		attrs = get_attributes_entropy(attrs, data.length);
		let max_gain = 0;
		let max_attr = null;
		for(let a in attrs) {
			let gain = InfoD - attrs[a];
			if(gain > max_gain) {
				max_attr = a;
				max_gain = gain;
			}
		}
		return max_attr;
	}

	function print_tree(node) {
		console.log(("_").repeat(aaa*2), node);
		aaa++;
		if(node && node.children) {
			for(let i in node.children) {
				print_tree(node.children[i]);
				aaa--;
			}
		}
	}

	/* Info(D) */
	function get_data_entropy(data) {
		// Conta ocorrências de cada classe
		let class_count = {};
		for(let i = 0; i < data.length; i++) {
			let class_value = data[i].target;
			if(class_count[class_value] === undefined) {
				class_count[class_value] = 0;
			}
			class_count[class_value]++;
		}
		// Calcula InfoD
		let data_count = data.length;
		let InfoD = 0;
		for(let c in class_count) {
			let pi = class_count[c] / data_count;
			InfoD += pi * Math.log2(pi);
		}
		return InfoD * -1;
	}

	/* Calcula entropia de cada atributo 
	 * Ver slide 54 aula 4 */
	function get_attributes_entropy(attrs, data_count) {
		for(let a in attrs) {
			let values = attrs[a];

			let atributte_value = 0;
			for(let v in values) {

				let class_count = values[v];
				let value_count = 0; // Ocorrências desse valor no atributo
				for(let c in class_count) {
					value_count += class_count[c];
				}

				let base = value_count / data_count;
				let sum_class_info = 0;
				for(let c in class_count) {
					let prob = class_count[c] / value_count;
					sum_class_info += prob * Math.log2(prob);
				}
				atributte_value += base * -sum_class_info;
			}
			// Sobrescreve com valor de cada atributo
			attrs[a] = atributte_value;
		}
		return attrs;
	}

	/* (aux)Para cada atributo conta a quantidade de cada classe
	 * agrupadas pelo seu valor para cada valor do atributo. 
	 * Resultado em 'attrs':
	 * [attr1: { 
	    	valor1: { classe_1: <qtd>, classe_2: <qtd> }, 
	    	valor2: { classe_1: <qtd> }
   		}, 
		attr2: { .. }, ...]
	 */
	function group_attributes_by_class(data) {
		let data_count = data.length;
		let attrs = {}; 		
		for(let attr of attribute_list) {
			
			// Agrupa instâncias pelo valor do atributo
			let values = {};
			for(let i = 0; i < data.length; i++) {
				let value = data[i][attr];
				if(values[value] === undefined) {
					values[value] = [];
				}
				values[value].push(data[i].target);
			}

			// Conta a ocorrência de cada classe para cada valor
			for(let i in values) {
				let count_values = {};
				for(let j = 0; j < values[i].length; j++) {
					let class_value = values[i][j];
					if(count_values[class_value] === undefined) {
						count_values[class_value] = 0;
					}
					count_values[class_value]++;
				}
				values[i] = count_values;
			}

			attrs[attr] = values;
		}
		return attrs;
	}

	/* Monta lista com os atributos que ocorrem em pelo
	 * menos uma instância */
	function get_attribute_list(data) {
		let attrs = [];
		for(let i = 0; i < data.length; i++) {
			for(let attr in data[i]) {
				if(attr !== 'target' && data[i].hasOwnProperty(attr)){
					if(attrs.indexOf(attr) === -1) {
						attrs.push(attr);
					}
				}
			} 
		}
		return attrs;
	}

})()