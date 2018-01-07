const decision_tree = require('./decision_tree');

var dataset = [
	{ A: 1, B: 1, C: 1, target: 1, },
	{ A: 1, B: 1, C: 2, target: 0, },
	{ A: 1, B: 2, C: 1, target: 0, },
	{ A: 1, B: 2, C: 2, target: 0, },
	{ A: 1, B: 2, C: 2, target: 0, },
	{ A: 2, B: 1, C: 1, target: 0, },
	{ A: 2, B: 1, C: 1, target: 0, },
	{ A: 2, B: 1, C: 3, target: 1, },
	{ A: 2, B: 2, C: 3, target: 1, },
	{ A: 2, B: 2, C: 3, target: 1, },
];
var num_attributes = 2; // select 2 out 3
var ntree = 10;

function build(ntree, instances, attributes_to_select) {
	console.log('ntree', ntree, 'attributes_to_select', attributes_to_select);

	let attribute_list = get_attribute_list(instances);

	let forests = [];
	for(let i = 0; i < ntree; i++) {
		let selected_attributes = random_select(attribute_list, attributes_to_select);
		console.log(i, 'selected_attributes:', selected_attributes);
		forests.push(decision_tree.build(instances, selected_attributes));
	}
	console.log('----------------------------------')
	for(tree of forests) {
		let output = decision_tree.print(tree, "\t");
		console.log(output)		
	}

	return forests;

}

/* Monta lista com os atributos que ocorrem em pelo
 * menos uma instância | TODO: função duplicada em decision_tree */
function get_attribute_list(data) {
	let attrs = [];
	for(let i = 0; i < data.length; i++) {
		for(let attr in data[i]) {
			if(attr !== 'target' && data[i].hasOwnProperty(attr)){
				if(attrs.indexOf(attr) === -1) {
					attrs.push(attr);
				}
			}
		} 
	}
	return attrs;
}

function random_select(attribute_list, attributes_to_select) {
	var to_remove_count = attribute_list.length - attributes_to_select;
	var to_remove_list = [];
	// Stupid thing... but...
	while(to_remove_list.length < to_remove_count) { // Complexidade cresce exponencialmente com o tamaho do array (TODO)
		let random = Math.floor(Math.random() * attribute_list.length);
		let selected = attribute_list[random];
		if(to_remove_list.indexOf(selected) === -1) {
			to_remove_list.push(selected);
		}
	}
	return attribute_list.filter((i) => {
		return to_remove_list.indexOf(i) === -1;
	});
}




build(ntree, dataset, num_attributes)