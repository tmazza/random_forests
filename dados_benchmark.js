/* Demostração de resultados com dados de benchmark
 * fornecidos. Mostra ganho obtido na seleção do atributo,
 * árvore gerada e resultados da classificação sobre as
 * próprias entradas de treinamento. */
const decision_tree = require('./src/decision_tree'),
	  data_provider = require('./src/data_provider');

decision_tree.set_debug(true);

data_provider.get_dataset('benchmark')
	.then(function(instances) {
		console.log('--- gain --------');
		let root_node = decision_tree.build(instances);
		
		console.log('\n---  tree -------');
		console.log(decision_tree.print(root_node, "\t"));
		
		console.log('--- results -----');
		for(let i = 0; i < instances.length; i++) {
			let evaluated = decision_tree.evaluate(root_node, instances[i]);
			console.log(i, evaluated, instances[i].target, evaluated === instances[i].target);
		}

	})