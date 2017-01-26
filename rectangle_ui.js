var express = require('express')
var app = express()

// app.set('views', __dirname+"demo");
app.set('views',".");
app.set('view engine', 'jade');

var path    = require("path");

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'))


app.get('/', function (req, res) {
  // res.send('Hello World!')
  res.sendFile('index.html');
  // res.sendFile('./demo/index.html')
  // res.sendFile(path.join(__dirname+'/demo/index.html'));

})

app.get('/login', function (req, res) {
  // res.send('Hello World!')
  // res.sendFile('./login.html');
  // res.sendFile('./demo/index.html')
  res.sendFile(path.join(__dirname+'/demo/login.html'));

})

app.listen(3000, function () {
  console.log('Example rectangle listening on port 3000!')
})