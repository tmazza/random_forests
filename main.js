const decision_tree = require('./src/decision_tree'),
	  data_provider = require('./src/data_provider');

decision_tree.set_debug(true);

data_provider.get_dataset('haberman')
	.then(function(instances) {
		console.log(instances);
	})