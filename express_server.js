var express = require('express');;
var app = express();

app.set('views',".");
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/promise', function (req, res) {
  res.sendFile(__dirname+'/index2.html');
});

app.get('/backbone',function (req, res) {
  res.sendFile(__dirname+'/index3.html');
})

app.listen(3000, function () {
  console.log('Express server listening on port 3000!');
});