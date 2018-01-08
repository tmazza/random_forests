/* A partir de um conjunto de instâncias, da quantidade de
 * parâmetros que devem ser selecionados para cada árvore
 * gera uma floresta de árvores de tamanho ntree.
 * Fornece método 'evaluate' para avaliar uma nova instância
 * para uma floresta aleatória.
 * */
module.exports = (function(){
	const decision_tree = require('./decision_tree');
	var enable_debug = false; // Mostra todas as árvores geradas
	
	return {
		build: build,
		evaluate: evaluate,
		set_debug: set_debug,
	}

	/////

	function build(ntree, instances) {
		let attribute_list = get_attribute_list(instances);

		let forests = [];
		for(let i = 0; i < ntree; i++) {
			let selected_attributes = random_select(attribute_list);
			let selected_dataset = bootstrap(instances);
			forests.push(decision_tree.build(selected_dataset, selected_attributes));	
		}

		if(enable_debug) {
			for(tree of forests) {
				let output = decision_tree.print(tree, "\t");
				console.log(output)		
			}
		}

		return forests;
	}

	/* Monta lista com os atributos que ocorrem em pelo
	 * menos uma instância | **função duplicada em decision_tree */
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

	/* Seleciona m atributos. Sendo m a raiz quadrada da quantidade 
	 * total de atributos no dataset
	 */
	function random_select(attribute_list) {
		var attributes_to_select = Math.round(Math.sqrt(attribute_list.length));
		var to_remove_count = attribute_list.length - attributes_to_select;
		var to_remove_list = [];
		// TODO: refatorar!!
		while(to_remove_list.length < to_remove_count) { // Complexidade cresce exponencialmente com o tamaho do array (TODO)
			let random = Math.floor(Math.random() * attribute_list.length);
			let selected = attribute_list[random];
			if(to_remove_list.indexOf(selected) === -1) {
				to_remove_list.push(selected);
			}
		}
		return attribute_list.filter((i) => {
			return to_remove_list.indexOf(i) === -1;
		});
	}

	/* Monta um subset com n instâncias selecionadas através
	 * de amostragem com reposição.
	 */
	function bootstrap(instances) {
		let selected = []; 
		while(selected.length < instances.length){
			let random_index = Math.floor(Math.random() * instances.length);
			selected.push(instances[random_index]);	
		}
		// console.log(selected.length);
		return selected;
	}

	function set_debug(bool) {
		enable_debug = bool;
	}

	function evaluate(forest, instance) {
		let class_count = {};
		for(let tree of forest) {
			let result_class = decision_tree.evaluate(tree, instance);
			if(class_count[result_class] === undefined) {
				class_count[result_class] = 0;
			}
			class_count[result_class]++;
		}

		let class_max = null;
		for(let i in class_count) {
			if(!class_max || class_count[i] > class_count[class_max]) {
				class_max = i;
			}
		}

		return class_max;
	}

})()
