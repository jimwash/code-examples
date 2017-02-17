class LV extends React.Component {



    // save contacts
	constructor(contacts) {
		super()
		this.config = contacts;
	};

    // an element in the list was clicked
	onclick(elem) {
	  callback(elem.target.id)
	  $(".loopliactive").removeClass("loopliactive");
	  $("#"+elem.target.id).parent().addClass("loopliactive");
	};

    // render an individual element
	listElements() { 
	  var self = this;
	  return (  this.config.contacts
	  .filter(function(contact) { return contact.email; })
	  .map(function(contact) {
	  	var clsname = "loopli";
	    return React.createElement('li', {onClick: self.onclick, className: clsname, key: contact.key},
	      React.createElement('div', {id:contact.key}, contact.name),
	      React.createElement('div', /* {href: 'mailto:'+contact.email} */ {}, contact.email)
	    )
	}))};


    // render the list
	render() {
		return (
				React.DOM.div({},
					[ React.DOM.h1({}, "Loops"),
					React.DOM.ul({}, this.listElements())	]				

				)
		);
	}
};