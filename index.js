var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");

var port = 8765;
var app = express();

app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/frontend');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Beginning of Speech-to-text setup
var credentials = null;

fs.readFile('./credentials-ibm.json','utf8', (err,jsonString) => {
  if(err){
    console.log("Error reading IBM Cloud Credentials:", err);
    return ;
  }
  try{
    credentials = JSON.parse(jsonString);
    console.log(credentials.username);
  }catch(err){
    console.log("Error parsing IBM Cloud Credentials:", err);
  }
});

const speechToText = new SpeechToTextV1({
  username: credentials.username,
  password: credentials.password,
  url: credentials.url,
  iam_apikey: credentials.iam_apikey
});

//End of Speech-to-text setup

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
