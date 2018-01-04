/** Gera uma árvode de decisão selecionando
  * como raiz o atributo que obtem o melhor
  * ganho de informação. */
(function(){
	var count = 0; // TEMP simulação de seleção de atributo
	var aaa = 0;


	var input = [
		// attr1: 50-50
		// attr2: 60-40
		// attr3: 50-50
		{ A: 1, B: 1, C: 1, target: true, },
		{ A: 2, B: 1, C: 1, target: true, },
		{ A: 1, B: 1, C: 1, target: false, },
		{ A: 2, B: 1, C: 1, target: true, },
		{ A: 1, B: 1, C: 1, target: false, },
		{ A: 2, B: 1, C: 1, target: true, },
		{ A: 1, B: 2, C: 1, target: true, },
		{ A: 2, B: 2, C: 1, target: true, },
		{ A: 1, B: 2, C: 1, target: true, },
		{ A: 2, B: 2, C: 1, target: true, },
	];


	var root_node = build_tree(input);
	print_tree(root_node);

	///// 

	function build_tree(data) {
		let attr = get_best_attribute(data);

		// Tem atributos que podem segmentar os dados?
		if(attr) {
			/* Dados ainda podem ser segmentados */

			// Conta quantidade de classes distintas nos dados
			let distinct_class = data.map(d => d.target).filter(function onlyUnique(value, index, self) { 
			    return self.indexOf(value) === index;
			}).length;

			if(distinct_class === 0) {
				/* ??? */
				return '???';
			} else if(distinct_class === 1) {
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
		count++;
		if(count > 3) return null;
		if(count == 1 ) return 'B';
		if(count == 2 ) return 'C';
		if(count == 3 ) return 'A';
	}

	function print_tree(node) {
		console.log(("_").repeat(aaa), node);
		aaa++;
		if(node && node.children) {
			for(let i in node.children) {
				print_tree(node.children[i]);
				aaa--;
			}
		}
	}

})()