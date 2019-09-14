var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path")
var kill = require('tree-kill');
var spawn = require("child_process").spawn

var port = 8765;
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname,"public")));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var PYTHON_SCRIPT_NAME = "ml/markovComboGen.py";
var MARKOV_PY_SCRIPT = "ml/markovTextGen.py"

app.get('/', function(req, res){
  res.render("index.html");
});
app.get('/impressionator', function(req, res){
  res.render("impressionator.html");
});

app.post('/api', function(req,res){
  var theJSON = null
  var input1 = req.body.data1
  var input2 = req.body.data2
  var pyScript = spawn('python', [path.join(__dirname, PYTHON_SCRIPT_NAME), input1, input2])
  pyScript.stdout.on('data', function(data){
      theJSON = JSON.stringify({output: data.toString()})
  });
  pyScript.stderr.on('data', function(data){
    console.log('error occurred:', data.toString('hex').match(/../g).join(' '));
  });
  pyScript.stderr.on('close', function(){
    res.send(JSON.parse(theJSON))
    kill(pyScript.pid);
  });
});

app.post('/api/markov', function(req,res){
  var theJSON = null
  var inputStr = req.body.select
  var pyScript = spawn('python', [path.join(__dirname, MARKOV_PY_SCRIPT), inputStr])
  pyScript.stdout.on('data', function(data){
      theJSON = JSON.stringify({output: data.toString()})
  });
  pyScript.stderr.on('data', function(data){
    console.log('error occurred: ', data.toString('hex').match(/../g).join(' '));
  });
  pyScript.stderr.on('close', function(){
    res.send(JSON.parse(theJSON))
    kill(pyScript.pid);
  });
});

app.listen(process.env.PORT || port);
console.log("We out here at port " + (process.env.PORT || port));
