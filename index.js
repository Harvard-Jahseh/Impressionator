var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path")
var kill = require('tree-kill');

var port = 8765;
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname,"public")));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var PYTHON_SCRIPT_NAME = "filler.py";

app.get('/', function(req, res){
  res.render("index.html");
});
app.get('/impressionator', function(req, res){
  res.render("impressionator.html");
});

app.post('/api', function(req,res){
  var inputStr = req.body.sample;
  console.log(req.body.sample)
  res.send({success: req.body.sample})
  // var spawn = require("child_process").spawn;
  // var pyScript = spawn('python',[PYTHON_SCRIPT_NAME,inputStr]);
  // console.log(pyScript)
  // process.stdout.on('data', function(data) {
  //     var theJSON = '{ "output": "' + data.toString() + '"}';
  //     res.send(JSON.parse(theJSON));
  // });
  var theJSON = null
  var inputStr = req.body.sample
  var spawn = require("child_process").spawn;
  var pyScript = spawn('python',["-u",path.join(__dirname, PYTHON_SCRIPT_NAME),inputStr]);
  pyScript.stdout.on('data', function(data){
      theJSON = JSON.stringify({output: data.toString()})
  });
  pyScript.stderr.on('data', function(data){
    console.log('error occurred: ',data);
  });
  pyScript.stderr.on('close', function(){
    res.send(JSON.parse(theJSON))
  });

  kill(pyScript.pid);
});
app.listen(process.env.PORT || port);
console.log("We out here at port " + (process.env.PORT || port));
