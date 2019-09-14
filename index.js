var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var port = 8765;
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render("index.html");
});

app.get('/api/:')

app.listen(process.env.PORT || port);
console.log("We out here at port " + (process.env.PORT || port));
