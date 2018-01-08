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
		{
			id: 'wine',
			filename: 'wine.data',
			fn: wine_dataset,
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

   /* 1. Title of Database: Wine recognition data
	* 	Updated Sept 21, 1998 by C.Blake : Added attribute information
	* 
	* 2. Sources:
	*    (a) Forina, M. et al, PARVUS - An Extendible Package for Data
	*        Exploration, Classification and Correlation. Institute of Pharmaceutical
	*        and Food Analysis and Technologies, Via Brigata Salerno, 
	*        16147 Genoa, Italy.
	* 
	*    (b) Stefan Aeberhard, email: stefan@coral.cs.jcu.edu.au
	*    (c) July 1991
	* 3. Past Usage:
	* 
	*    (1)
	*    S. Aeberhard, D. Coomans and O. de Vel,
	*    Comparison of Classifiers in High Dimensional Settings,
	*    Tech. Rep. no. 92-02, (1992), Dept. of Computer Science and Dept. of
	*    Mathematics and Statistics, James Cook University of North Queensland.
	*    (Also submitted to Technometrics).
	* 
	*    The data was used with many others for comparing various 
	*    classifiers. The classes are separable, though only RDA 
	*    has achieved 100% correct classification.
	*    (RDA : 100%, QDA 99.4%, LDA 98.9%, 1NN 96.1% (z-transformed data))
	*    (All results using the leave-one-out technique)
	* 
	*    In a classification context, this is a well posed problem 
	*    with "well behaved" class structures. A good data set 
	*    for first testing of a new classifier, but not very 
	*    challenging.
	* 
	*    (2) 
	*    S. Aeberhard, D. Coomans and O. de Vel,
	*    "THE CLASSIFICATION PERFORMANCE OF RDA"
	*    Tech. Rep. no. 92-01, (1992), Dept. of Computer Science and Dept. of
	*    Mathematics and Statistics, James Cook University of North Queensland.
	*    (Also submitted to Journal of Chemometrics).
	* 
	*    Here, the data was used to illustrate the superior performance of
	*    the use of a new appreciation function with RDA. 
	* 
	* 4. Relevant Information:
	* 
	*    -- These data are the results of a chemical analysis of
	*       wines grown in the same region in Italy but derived from three
	*       different cultivars.
	*       The analysis determined the quantities of 13 constituents
	*       found in each of the three types of wines. 
	* 
	*    -- I think that the initial data set had around 30 variables, but 
	*       for some reason I only have the 13 dimensional version. 
	*       I had a list of what the 30 or so variables were, but a.) 
	*       I lost it, and b.), I would not know which 13 variables
	*       are included in the set.
	* 
	*    -- The attributes are (dontated by Riccardo Leardi, 
	* 	riclea@anchem.unige.it )
	*  	1) Alcohol
	*  	2) Malic acid
	*  	3) Ash
	* 	4) Alcalinity of ash  
	*  	5) Magnesium
	* 	6) Total phenols
	*  	7) Flavanoids
	*  	8) Nonflavanoid phenols
	*  	9) Proanthocyanins
	* 	10)Color intensity
	*  	11)Hue
	*  	12)OD280/OD315 of diluted wines
	*  	13)Proline            
	* 
	* 5. Number of Instances
	* 
	*   class 1 59
	* 	class 2 71
	* 	class 3 48
	* 
	* 6. Number of Attributes 
	* 	
	* 	13
	* 
	* 7. For Each Attribute:
	* 
	* 	All attributes are continuous
	* 	
	* 	No statistics available, but suggest to standardise
	* 	variables for certain uses (e.g. for us with classifiers
	* 	which are NOT scale invariant)
	* 
	* 	NOTE: 1st attribute is class identifier (1-3)
	* 
	* 8. Missing Attribute Values:
	* 
	* 	None
	* 
	* 9. Class Distribution: number of instances per class
	* 
	*   class 1 59
	* 	class 2 71
	* 	class 3 48 */
	function wine_dataset(dataset) {
  		let attribute_target = 'cultivars';
		let attribute_list = [ 'alcohol', 
		  'malic_acid', 'ash', 'alcalinity_of_ash',
		  'magnesium', 'total_phenols', 'flavanoids', 'nonflavanoid_phenols',
		  'proanthocyanins', 'color_intensity', 'hue', 
		  'od280/od315_of_diluted_wines', 'proline '];
		let attribute_continuous = attribute_list;

		// Classe é o primeiro
		attribute_list.unshift(attribute_target);

		return read_file(dataset.filename)
			.then(function(data) {
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