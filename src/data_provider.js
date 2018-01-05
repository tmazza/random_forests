/* Retorna lista de instâncias discretizadas e com
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
		},
		{
			id: 'haberman',
			filename: 'haberman.data',
			fn: haberman_dataset,
		},
	];

	return {
		get_dataset: get_dataset,
	};

	///

	function benchmark_dataset(dataset) {

		let attribute_target = 'Joga'; // Atributo que representa a classe

		return read_file(dataset.filename).then(function(data) {
			let lines = data.split("\n").map(l => l.split(';'));
			let attribute_list = lines.shift();
			lines.pop(); // Remove linha em branco do final
			return make_instances(attribute_target, attribute_list, lines);
		})
	}

	/*  1. Title: Haberman's Survival Data
	 *
	 *	2. Sources:
	 *	   (a) Donor:   Tjen-Sien Lim (limt@stat.wisc.edu)
	 *	   (b) Date:    March 4, 1999
	 *
	 *	3. Past Usage:
	 *	   1. Haberman, S. J. (1976). Generalized Residuals for Log-Linear
	 *	      Models, Proceedings of the 9th International Biometrics
	 *	      Conference, Boston, pp. 104-122.
	 *	   2. Landwehr, J. M., Pregibon, D., and Shoemaker, A. C. (1984),
	 *	      Graphical Models for Assessing Logistic Regression Models (with
	 *	      discussion), Journal of the American Statistical Association 79:
	 *	      61-83.
	 *	   3. Lo, W.-D. (1993). Logistic Regression Trees, PhD thesis,
	 *	      Department of Statistics, University of Wisconsin, Madison, WI.
	 *
	 *	4. Relevant Information:
	 *	   The dataset contains cases from a study that was conducted between
	 *	   1958 and 1970 at the University of Chicago's Billings Hospital on
	 *	   the survival of patients who had undergone surgery for breast
	 *	   cancer.
	 *
	 *	5. Number of Instances: 306
	 *
	 *	6. Number of Attributes: 4 (including the class attribute)
	 *
	 *	7. Attribute Information:
	 *	   1. Age of patient at time of operation (numerical)
	 *	   2. Patient's year of operation (year - 1900, numerical)
	 *	   3. Number of positive axillary nodes detected (numerical)
	 *	   4. Survival status (class attribute)
	 *	         1 = the patient survived 5 years or longer
	 *	         2 = the patient died within 5 year
	 *
	 *	8. Missing Attribute Values: None */
	function haberman_dataset(dataset) {
		let attribute_target = 'survival';
		let attribute_list = ['age', 'year', 'nodes', attribute_target];

		return read_file(dataset.filename).then(function(data) {
			let lines = data.split("\n").map(l => l.split(','));
			return make_instances(attribute_target, attribute_list, lines);
		});
	}

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

	function read_file(filename) {
		var filePath = path.join(__dirname, data_dir, filename);
		return new Promise(function(resolve) {
			fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
		        resolve(data);
			});
		});
	}

	function make_instances(attribute_target, attribute_list, lines) {
		let instances = [];
		for(let i = 0; i < lines.length; i++) {
			let instance = {};
			for(let j = 0; j < lines[i].length; j++) {
				let attr_name = attribute_list[j] === attribute_target ? 'target' : attribute_list[j];
				instance[attr_name] = lines[i][j];
			}
			instances.push(instance);
		}
		return instances;
	}


})();