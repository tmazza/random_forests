const random_forest = require('./src/random_forest'),
	  data_provider = require('./src/data_provider');

// random_forest.set_debug(true);

var ntrees_values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

let process_dataset = function(dataset_alias) {
	console.log('---- ' + dataset_alias + ' ----');

	return function(instances) {
		for(let ntree of ntrees_values) {
			let forest = random_forest.build(ntree, instances);
			let count = 0;
			for(let i of instances) {
				let result_class = random_forest.evaluate(forest, i);
				count += result_class === i.target ? 1 : 0;
			}
			console.log(ntree, count, instances.length, Math.round(count/instances.length*100)+'%')
		}
	}
}

data_provider.get_dataset('haberman')
	.then(process_dataset('haberman'));

data_provider.get_dataset('wine')
	.then(process_dataset('wine'));