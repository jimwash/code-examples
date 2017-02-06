var express = require('express');
var ws = require('./workstations');

var app = express();

app.set('views', ".");
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.get('/promise', function(req, res) {
	res.sendFile(__dirname + '/index2.html');
});

app.get('/backbone', function(req, res) {
	res.sendFile(__dirname + '/rectangle/index.html');
});

app.get('/stayloopt', function(req, res) {
	res.sendFile(__dirname + '/index4.html');
});

app.get('/elevator', function(req, res) {
	res.sendFile(__dirname + '/elevator/index.html');
});

app.get('/workstations', function(req, res) {
	var orderrows1 = [new ws.OrderRow(200, 1, 5), new ws.OrderRow(210, 5, 8), new ws.OrderRow(220, 6, 1)];

	// Create the order
	var order = new ws.Order(1, orderrows1);

	// Setup the stations
	app.stationcontroller = new ws.StationsControl();

	// Add the order to the stations
	app.stationcontroller.addOrder(order); 
	res.sendFile(__dirname + '/index6.html');
});

app.get('/workstationsstatus', function(req,res) {
	var ret = {};

    // check to make sure the controller has been created and orders are running
    //if (typeof app.stationcontroller !== 'undefined') {
	    ret = app.stationcontroller.status();
    //}

    console.log("STATUS:"+ret);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ret, null, 3));
});

app.listen(3000, function() {
	console.log('Express server listening on port 3000!');
});

