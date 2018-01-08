const random_forest = require('./src/random_forest'),
	  data_provider = require('./src/data_provider');

// random_forest.set_debug(true);

// var ntrees_values = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023];
var ntrees_values = [2];

let haberman = process_dataset('haberman')
// let wine = process_dataset('wine')
// let cmc = process_dataset('cmc')
// let wpbc = process_dataset('wpbc')

function process_dataset(dataset_alias) {
	return data_provider.get_dataset(dataset_alias)
		.then(function(instances) {
			let data = random_split(instances);

			console.log('----- ' + dataset_alias + ' -----');
			console.log('Instâncias:\t', instances.length);
			console.log('Treinamento:\t', data.train.length);
			console.log('Teste:\t\t', data.test.length);

			for(let ntree of ntrees_values) {
				let forest = random_forest.build(ntree, instances);
				let count = 0;
				for(let i of instances) {
					let result_class = random_forest.evaluate(forest, i);
					count += result_class === i.target ? 1 : 0;
				}
				console.log(ntree, count + '/' + instances.length, Math.round(count/instances.length*100)+'%')
			}
		});
}

function random_split(data, size = 0.8) {
	// shuffle
	data.sort((a,b)=> Math.random() > Math.random())
	// split
	let break_point = Math.round((data.length) * size);
	return {
		train: data.slice(0, break_point),
		test: data.slice(break_point, data.length),
	}
}