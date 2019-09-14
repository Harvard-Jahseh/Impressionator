var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path")

var port = 8765;
var app = express();

app.use(express.static(path.join(__dirname,"public")));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var PYTHON_SCRIPT_NAME = "./filler.py";

app.get('/', function(req, res){
  res.render("index.html");
});
app.get('/impressionator', function(req, res){
  res.render("impressionator.html");
});

app.post('/api', function(req,res){
  var inputStr = req.params.sample;
  console.log(req.body)
  console.log(req.params)
  var spawn = require("child_process").spawn;
  var pyScript = spawn('python',[PYTHON_SCRIPT_NAME,inputStr]);
  process.stdout.on('data', function(data) {
      var theJSON = '{ "output": "' + data.toString() + '"}';
      res.send(JSON.parse(theJSON));
  });
});
app.listen(process.env.PORT || port);
console.log("We out here at port " + (process.env.PORT || port));
