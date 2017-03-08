class TB extends React.Component {

    // save contacts
	constructor(contacts) {
		super();
		this.config = contacts;
	};

    // an element in the list was clicked
	onclick(elem) {
	  callback(elem.target.id)
	};

	lbarElements() { 
	  var self = this;
	  return (  ['safe house','loops']
	  .map(function(item) {
	    var clsname = "ltooli";
            return <td onClick={self.onclick} className={clsname}>
                   <span>{item}</span>
                   </td> 
	  }))};

	rbarElements() { 
	  var self = this;
	  return (  ['about us','contact']
	  .map(function(item) {
	    var clsname = "rtooli";
            return <td onClick={self.onclick} className={clsname}>
                   <span>{item}</span>
                   </td> 
	}))};

    // render the list
	render() {
		return (
             <div className="toolbar">
                 <table className="leftTable">
                    <tr>
                    { this.lbarElements() }
                    </tr>
                 </table>
                 <table className="rightTable">
                    <tr>
                    { this.rbarElements() }
                    </tr>
                 </table>
             </div>
		);
	}
};
