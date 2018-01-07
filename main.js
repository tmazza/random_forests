const decision_tree = require('./src/decision_tree'),
	  data_provider = require('./src/data_provider');

decision_tree.set_debug(true);

data_provider.get_dataset('haberman')
	.then(function(instances) {
		console.log('--- gain --------');
		let root_node = decision_tree.build(instances);
		
		console.log('\n---  tree -------');
		let output = decision_tree.print(root_node, "\t");
		console.log(output);
		
		console.log('--- results -----');
		let acertos = 0;
		for(let i = 0; i < instances.length; i++) {
			let evaluated = decision_tree.evaluate(root_node, instances[i]);
			if(evaluated === instances[i].target) {
				acertos++;
			}
			console.log(i, evaluated, instances[i].target, evaluated === instances[i].target);
		}
		console.log(acertos, instances.length, Math.round((acertos/instances.length)*100)+'%');
	})