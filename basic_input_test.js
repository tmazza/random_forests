const decision_tree = require('./src/decision_tree');

var input = [
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

var root_node = decision_tree.build(input);
decision_tree.print(root_node);


for(let i = 0; i < input.length; i++) {
	let evalueted = decision_tree.evaluate(root_node, input[i]);
	console.log(i, ''+input[i].target, evalueted, input[i].target === Number(evalueted));
}