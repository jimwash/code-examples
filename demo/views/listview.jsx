class LV extends React.Component {
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
   
	listElements() { 
	  var self = this;
	  return (  this.config.contacts
	  .filter(function(contact) { return contact.email; })
	  .map(function(contact) {
	    var clsname = "loopli";
            return <li onClick={self.onclick} className={clsname}>
		      <div id={contact.key}>{contact.name}</div>
                      <div>{contact.email}</div>
                    </li>

	}))};

	render() {
		return (
			<div>
			    <h1 className="looph1">Loops</h1>
			    <ul> {this.listElements()} </ul>
			</div>
		);
	}
};