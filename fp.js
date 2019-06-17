
const {CF, evaluation} = require('nodeml');
var bodyParser = require('body-parser');

 
let train =
     [["we", "rock festival", 2], ["we", "coll", 2], ["we", "riavle", 5], ["hyemin", "riavle", 5],
    ["hyemin", "rock festival", 2], ["yeon", "riavle", 2], ["yeon", "coll", 3], ["yeon", "algo", 3],
    ["jeff","rock festival",2],["jeff","coll",2],["jeff","riavle",5],["some","rock festival",2]
];
 
var test = [["some"]]
const cf = new CF();
cf.train(train);
let gt = cf.gt(test);
let result = cf.recommendGT(gt, 3);
 
let ndcg = evaluation.ndcg(gt, result);
 
console.log(gt);
console.log(result);
console.log(ndcg);



var express = require('express')

var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

 
app.listen(3001, function(){
    console.log("Express server has started on port 3000")
})

app.get('/', function(req, res){
    if(req.query.method == "train"){
        console.log(req.query)
        console.log()
        var traindata = [req.query.name,req.query.phost, parseInt(req.query.point)]
        cf.train(traindata);
    }else{
        var username = req.query.name
        let gt = cf.gt([[username]]);
        console.log(gt)
        res.send(gt);
    }
    
});

