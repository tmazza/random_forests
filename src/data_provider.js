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
		let attribute_continuous = ['age', 'year', 'nodes'];

		return read_file(dataset.filename).then(function(data) {
			let lines = data.split("\n").map(l => l.split(','));
			let instances = make_instances(attribute_target, attribute_list, lines);
			return discretization(attribute_continuous, instances);
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

	function discretization(attribute_continuous, instances) {
		// ----------
		for(let attr of attribute_continuous) {
			// Busca conjunto de valores de um atributo do dataset "pega uma coluna" do dataset
			attr_values = [];
			for(let i of instances) {
				attr_values.push(Number(i[attr]));
			}
			attr_values.sort((a,b) => a-b)
			attr_values = attr_values.filter(function onlyUnique(value, index, self) { 
			    return self.indexOf(value) === index;
			});

			let distinct_values = attr_values.length;
			if(distinct_values > 5) {
				// Usa sqrt(qtd. valores distintos) como pontos de corte
				let thresholds = Math.round(Math.sqrt(distinct_values));
				let index_step = Math.round(attr_values.length/thresholds);

				// Gera pontos de corte
				let attr_rules = [];
				for(let i = index_step; i < distinct_values-1; i+=index_step) {
					let rule = {};
					if(i === index_step) {
						rule['label'] = '<' + attr_values[i];
						rule['test'] = (function(v1){
							return function(v) { return v < v1; }
						})(attr_values[i]);
					} else {
						rule['label'] = attr_values[i-index_step] + '-' + attr_values[i];
						rule['test'] = (function(v1, v2){
							return function(v) { return v >= v1 && v <= v2; }
						})(attr_values[i-index_step], attr_values[i]);
					}
					attr_rules.push(rule)
				}
				let last = attr_values[distinct_values-index_step-1];
				attr_rules.push({
					label: '>'+last,
					test: (function(v1){
						return function(v) { return v > v1; }
					})(last)
				})

				// Altera valores das instancias baseado nos pontos de corte
				for(let i in instances) {
					let rule = attr_rules.find(r => {
						return r.test(instances[i][attr]);
					})
					if(rule) {
						instances[i][attr] = rule.label;
					} else {
						console.log('*****', 'sem classe???');
					}
				}
			}
		}
		return instances;
	}


})();