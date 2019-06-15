const {CF, evaluation} = require('nodeml');
 
let train = [[1, "rock festival", 2], [1, "coll", 2], [1, "riavle", 5], [2, "riavle", 5],
    [2, "rock festival", 1], [3, "riavle", 2], [3, "coll", 3], [3, 3, 3]];
let test = [[3]];
 
const cf = new CF();
cf.train(train);
let gt = cf.gt(test);
let result = cf.recommendGT(gt, 1);
 
let ndcg = evaluation.ndcg(gt, result);
 
console.log(gt);
console.log(result);
console.log(ndcg);