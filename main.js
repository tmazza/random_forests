const random_forest = require('./src/random_forest'),
	  data_provider = require('./src/data_provider');

// random_forest.set_debug(true);

var ntrees_values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
// var ntrees_values = [2,];

let process_dataset = function(dataset_alias) {

	return function(instances) {
		console.log('---- ' + dataset_alias + ' ----');
		for(let ntree of ntrees_values) {
			let forest = random_forest.build(ntree, instances);
			let count = 0;
			for(let i of instances) {
				let result_class = random_forest.evaluate(forest, i);
				count += result_class === i.target ? 1 : 0;
			}
			console.log(ntree, count + '/' + instances.length, Math.round(count/instances.length*100)+'%')
		}
	}
}

let haberman = data_provider.get_dataset('haberman')
let wine = data_provider.get_dataset('wine')
let cmc = data_provider.get_dataset('cmc')
let wpbc = data_provider.get_dataset('wpbc')
	
haberman
	.then(process_dataset('haberman'))
	.then(() => wine)
	.then(process_dataset('wine'))
	.then(() => cmc)
	.then(process_dataset('cmc'))
	.then(() => wpbc)
	.then(process_dataset('wpbc'))
