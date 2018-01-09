/* Abre, treina e avalia acurácia dos arquivos (.data em /data).
 * Separa instâncias aleatóriamente entre 80% para treinamento e validação
 * e 20% para teste. Aplica leave-one-out cross-validation para verificar
 * qual o melhor valor de ntree (dentro de um conjunto pré-definido) obtem 
 * o melhor resultado. Aplica floresta com ntree que obteve melhor resultado
 * no conjunto de teste (20%) reservados no início do processamento.
 */
const random_forest = require('./src/random_forest'),
	  data_provider = require('./src/data_provider');

// random_forest.set_debug(true); // Mostra cada uma das árvores geradas

// var ntrees_values = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 5000];
// var ntrees_values = [1, 3, 7, 15, 31, 63];
var ntrees_values = [1, 3, 5];

process_dataset('haberman')
// process_dataset('wine')
// process_dataset('cmc')
// process_dataset('wpbc')

////

function process_dataset(dataset_alias) {
	return data_provider.get_dataset(dataset_alias)
		.then(function(instances) {
			let data = random_split(instances);
			print_header(dataset_alias, instances, data);

			let best_ntree = cross_validation(data);
			print_best_ntree(best_ntree);

			// Gera modelo com melhor ntree avaliado
			let best_model = random_forest.build(best_ntree.value, data.train);
			// Avalia desempenho nos dados de teste
			let count = 0;
			for(let i of data.test) {
				let result_class = random_forest.evaluate(best_model, i);
				// console.log(i.target, result_class, i.target === result_class);
				if(i.target === result_class) {
					count++;
				}
			}
			let accuracy = Math.round(count/data.test.length*100) + '%';
			console.log('Acurácia:\t', accuracy, '- nos dados de teste')

		});
}


function cross_validation(data) {
	// leave-one-out cross-validation
	let best_ntree = null;
	for(let ntree of ntrees_values) {
		let count = 0; // Predições corretas

		// Track progress
		let train_length = data.train.length;
		let unit = Math.round((train_length/100) * 13);
		
		for(let i in data.train) {
			let one_out = copy_with_one_out(data.train, i);
			let forest = random_forest.build(ntree, data.train);
			let result_class = random_forest.evaluate(forest, data.train[i]);
			// console.log(i, data.train[i], data.train[i].target === result_class);
			if(data.train[i].target === result_class) {
				count++;
			}
			if(i % unit === 0 || Number(i) === train_length-1) {
				let progress = Math.round((Number(i)+1) / train_length * 100);
				process.stdout.write('\r ' + progress +'% ... ')
			}
		}
		console.log('ntree ' + ntree + ':\t', count + '/' + data.train.length, Math.round(count/data.train.length*100)+'%');

		let accuracy = count/data.train.length;
		if(!best_ntree || best_ntree.accuracy < accuracy) {
			best_ntree = {
				value: ntree,
				accuracy: accuracy,
			};
		}
	}
	return best_ntree;
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

function copy_with_one_out(data, i) {
	let size_train = data.length;
	let one_out = [];
	if(Number(i) === 0) {
		one_out = data.slice(1, size_train);
	} else if(Number(i) === size_train-1) {
		one_out = data.slice(0, size_train-1);
	} else {
		one_out = data.slice(0, i).concat(data.slice(-(size_train-1-i)))
	}
	return one_out;
}

function print_header(dataset_alias, instances, data) {
	console.log('');
	console.log('---------------------');
	console.log('----- ' + dataset_alias + ' -----');
	console.log('Instâncias:\t', instances.length);
	console.log('Treinamento:\t', data.train.length);
	console.log('Teste:\t\t', data.test.length);
	console.log('---------------------');
}

function print_best_ntree(best_ntree) {
	console.log('---------------------')
	console.log('Melhor ntree:\t', best_ntree.value);
	console.log('% acertos\t', Math.round(best_ntree.accuracy*100)+'% - durante validação');

}