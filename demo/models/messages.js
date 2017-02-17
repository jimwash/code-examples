var Messages = function() {
    this.messages = [];
};

// TO DO need to be able to configure the destination

// Add a rectangle to the container
// break up remaining space into 2 other containers
Messages.prototype.insert = function(message) {

	var data = { message: message.message, toemail: message.toemail, subject: message.subject, schedule: message.schedule };

	return fetch('http://localhost:3010/insert', {
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(data)
	}).then(function(response) {
		console.log(response.id)
		return response.json();
	});
}

Messages.prototype.update = function(message) {

	var data = { message: message.message, toemail: message.toemail, subject: message.subject, schedule: message.schedule, id: message.id };

	return fetch('http://localhost:3010/update', {
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(data)
	}).then(function(response) {
		console.log(response.id)
		return response.json();
	});
}


Messages.prototype.list = function(filters) {
	return fetch('http://localhost:3010/messages', { method: "GET" }).then(function(response) {
		return response.json();
	});
}