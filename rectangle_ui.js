var express = require('express');;
var app = express();

app.set('views',".");
app.set('view engine', 'jade');

var path    = require("path");

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.listen(3000, function () {
  console.log('Example rectangle listening on port 3000!');
});