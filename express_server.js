var express = require('express');
var ws = require('./workstations');

var app = express();

app.set('views', ".");
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'));

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:N0Return@localhost:5432/messanger')

var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

// app.set('views', __dirname+"demo");
app.set('views',"demo");
app.set('view engine', 'jade');

var path    = require("path");

app.use(express.static(__dirname + '/demo'));


var bodyParser = require('body-parser')

var toemail = 'jimwash@gmail.com'
var subject = 'Hello'
var runat = Date.now()





app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.get('/promise', function(req, res) {
	res.sendFile(__dirname + '/index2.html');
});

app.get('/backbone', function(req, res) {
	res.sendFile(__dirname + '/rectangle/index.html');
});

app.get('/sx', function(req, res) {
	res.sendFile(__dirname + '/index8.html');
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

app.get('/react', function(req,res) {
	res.sendFile(__dirname + '/hello-world/index.html');
});

 
app.post('/insert', bodyParser.json(), function (req, res) {
	var abc = req.body.message;
	toemail = req.body.toemail;
	subject = req.body.subject;
	runat = req.body.schedule;
    db.one("insert into db.message (message,recipient,subject,schedule) values ('"+abc+"','"+toemail+"','"+subject+"','"+runat+"') returning id;")
	  .then(function (data) {
	  	console.log("DATA:"+JSON.stringify(data));
	  	res.send(data)
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	    res.send(error);
	  })

	// res.send("UPD DB")

})

app.post('/update', bodyParser.json(), function (req, res) {
	var abc = req.body.message;
	toemail = req.body.toemail;
	subject = req.body.subject;
	runat = req.body.schedule;
	id = req.body.id;
    db.none("update db.message set message='"+abc+
    	    "', recipient='"+toemail+
    	    "', subject='"+subject+
    	    "', schedule='"+runat+
    	    "' where id='"+id+"';")
	  .then(function () {
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	  })

	res.send("UPD DB")

})

app.get('/message/:id', function (req, res) {

	console.log("In /message");

    var id = req.params.id; // $_GET["id"]
	var messages = [];

	db.one('SELECT * from db.message where id = '+id)
	  .then(function (data) {
	  	messages = data;
	    console.log('Messages:', data)
	    res.send(JSON.stringify(messages))
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	    res.send("[]")
	  })
})

app.get('/messages', function (req, res) {

	console.log("In /messages");

	var messages = [];

	db.many('SELECT * from db.message')
	  .then(function (data) {
	  	messages = data;
	    console.log('Messages:', data)
	    res.send(JSON.stringify(messages))
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	    res.send("[]")
	  })

    
    //console.log("finishing /messages");
	//res.send(JSON.stringify(messages));
})

app.get('/db', function (req, res) {

	console.log("In /db");

	db.one('SELECT message from db.message')
	  .then(function (data) {
	    var date = new Date(Date.now() + 10000); 
	    schedule.scheduleJob(date, function(){
	      console.log('Future:', data.message);
	    });
	
	    console.log('Now:', data.message)
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	  })

    console.log("finishing /db");
	res.send("REQ DB")
})

app.get('/mail', function (req, res) {

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport('smtps://jimwash%40gmail.com:Joan2TooCute@smtp.gmail.com');
	
	db.one('SELECT message from db.message')
	  .then(function (data) {
	
	    console.log("to:"+toemail);
	    console.log("subject:"+subject);
	
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '"stayloopt" <jimwash@gmail.com>', // sender address
		    to: toemail, // list of receivers
		    subject: subject, // Subject line
		    text: 'no html', // plaintext body
		    html: data.message, // html body
		    attachments: [
		        {   
		            path: 'C:/Users/jimwash/Desktop/DSC_2462.JPG' // stream this file
		        }]
		};
		
	    var runat = new Date(Date.now() + 100); 
	    console.log("SCHEDULE");
	    schedule.scheduleJob(runat, function(){
	        console.log('Future:', data.message);
			
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});
	    });
	    console.log("DID SCHEDULE")

	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	  })	
	res.send("message sent!")
})



app.listen(3010, function() {
	console.log('Express server listening on port 3000!');
});


