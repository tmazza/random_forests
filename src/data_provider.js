/* Retorna lista de instância discretizadas e com
 * atributo classe do dataset renomeado para 'target' */
module.exports = (function(){

	var fs = require('fs'),
		path = require('path');

	var data_dir = '../data/';

	var datasets = [
		{
			id: 'benchmark',
			filename: 'dados_benchmark.csv',
			fn: benchmark_dataset,
		}
	];

	return {
		get_dataset: get_dataset,
	};

	///

	function get_dataset(dataset_id) {
		let dataset = datasets.find(d => {
			return d.id === dataset_id;
		})
		if(dataset) {
			return dataset.fn(dataset);
		} else {
			console.log('** Dataset', "'"+dataset_id+"'", 'não encontrado.');
			return undefined;
		}
	}

	function benchmark_dataset(dataset) {

		let attr_target = 'Joga'; // Atributo que representa a classe

		return get_file(dataset.filename).then(function(data) {
			let lines = data.split("\n").map(l => l.split(';'));
			let attribute_list = lines.shift();
			lines.pop(); // Remove linha em branco do final

			let instances = [];
			for(let i = 0; i < lines.length; i++) {
				let instance = {};
				for(let j = 0; j < lines[i].length; j++) {
					let attr_name = attribute_list[j] === attr_target ? 'target' : attribute_list[j];
					instance[attr_name] = lines[i][j];
				}
				instances.push(instance);
			}
			return instances;
		})
	}


	function get_file(filename) {
		var filePath = path.join(__dirname, data_dir, filename);
		return new Promise(function(resolve) {
			fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
		        resolve(data);
			});
		});
	}

})();