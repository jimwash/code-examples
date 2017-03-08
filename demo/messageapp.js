LV = React.createFactory(LV);
TB = React.createFactory(TB);

var callback = function(id) {
	console.log(id);
	var msg = new Message();
	msg.getMessage(id).then(function(data){
		console.log("GOT:"+JSON.stringify(data))
		// newEditor.setMessage(data);
		newEditor = new Editor({onchange: msgchange, data: data});
	    var element = document.getElementById('app');
	    ReactDOM.unmountComponentAtNode(element)

		ReactDOM.render(
			newEditor,
			element
		);

	})
}

var toolbarcb = function(id) {

}

var msgchange = function() {
	// a message was inserted
	// re-display list
    loadMessages();
}

var loadMessages = function() {
	var msgs = new Messages();
	var self = this;
	msgs.list().then(function(data) {
		console.log("DATA:"+data);
		var contacts = new Array();
		for (var i=0;i<data.length;i++) {
			contacts.push({key:data[i].id, name: data[i].subject, email: data[i].recipient});
		}

		LVobj = new LV({contacts:contacts,cb:callback})

		TBobj = new TB({tbcb:toolbarcb});

		var tbelement = document.getElementById('tool-bar');
		ReactDOM.unmountComponentAtNode(tbelement)


		ReactDOM.render(
			TBobj,
			tbelement
		);


		var element = document.getElementById('side-list');
		ReactDOM.unmountComponentAtNode(element)

		ReactDOM.render(
			LVobj,
			element
		);


		//

	});	
}

loadMessages();

Editor = React.createFactory(Editor);
// ReactQuill = React.createFactory(ReactQuill);
newEditor = new Editor({onchange: msgchange});

ReactDOM.render(
	newEditor,
	document.getElementById('app')
);