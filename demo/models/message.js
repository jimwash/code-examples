var Message = function(message,toemail,subject,schedule,id) {
    this.message = message;
    this.toemail = toemail;
    this.subject = subject;
    this.schedule = schedule;
    this.id = id;
};


// Add a rectangle to the container
// break up remaining space into 2 other containers
Message.prototype.update = function() {
}

Message.prototype.send = function() {
	
}

Message.prototype.getMessage = function(id) {
	var url = "http://localhost:3010/message/"+id;

	return fetch(url, { method: "GET" } ).then(function(response) {
		return response.json();
	});
}