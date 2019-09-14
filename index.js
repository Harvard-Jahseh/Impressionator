var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var port = 8765;
var app = express();

app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/frontend');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var PYTHON_SCRIPT_NAME = "./filler.py";

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render("index.html");
});

app.post('/api', function(req,res){
  var inputStr = req.params.sample;
  var spawn = require("child_process").spawn;
  var pyScript = spawn('python',[PYTHON_SCRIPT_NAME,inputStr]);
  process.stdout.on('data', function(data) {
      var theJSON = '{ "output": "' + data.toString() + '"}';
      res.send(JSON.parse(theJSON));
  });
});
app.listen(process.env.PORT || port);
console.log("We out here at port " + (process.env.PORT || port));
