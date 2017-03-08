/* global React */
/* global ReactQuill */
'use strict'

var DateTimePicker = ReactWidgets.DateTimePicker;

var Editor = React.createClass({
	getInitialState: function () {
		return {
			shownid: -1,
			theme: 'snow',
			enabled: true,
			readOnly: false,
			value: '',
			events: []
		};
	},

	setMessage: function(message) {
		this.setState({ subject: message.subject, value: message.message, toemail: message.toemail, value0: message.schedule })
        this.render();
	},
    
	formatRange: function (range) {
		return range
			? [range.start, range.end].join(',')
			: 'none';
	},

    toemail: '',
    
	onTextareaChange: function(event) {
		var value = event.target.value;
		this.setState({ value:value });
	},
	
	onSubjectTextareaChange: function(event) {
		var value = event.target.value;
		this.setState({ subject: value });
	},
		
	onEmailTextareaChange: function(event) {
		var value = event.target.value;
		this.setState({ toemail: value });
	},
	
	onEditorChange: function(value, delta, source) {
		this.setState({
			value: value,
			events: [
				'text-change('+this.state.value+' -> '+value+')'
			].concat(this.state.events)
		});
	},

	onEditorChangeSelection: function(range, source) {
		this.setState({
			selection: range,
			events: [
				'selection-change('+
					this.formatRange(this.state.selection)
				+' -> '+
					this.formatRange(range)
				+')'
			].concat(this.state.events)
		});
	},

	onToggle: function() {
		this.setState({ enabled: !this.state.enabled });
	},

	onToggleReadOnly: function() {
		this.setState({ readOnly: !this.state.readOnly });
	},

	handleClick: function(elem) {
	    console.log(this.state.value);
        var msg = new Message(this.state.value,this.state.toemail,this.state.subject,this.state.value0);
        var msgcollection = new Messages();
        var self = this;
        if (elem.currentTarget.textContent == "Insert") {
	        msgcollection.insert(msg).then(function(data) {
	        	console.log("DATA:"+data.id);
	            self.state.msgid = data.id;
	            console.log("SET:"+self.state.msgid)
	            self.props.onchange();
	        })
        } else if (elem.currentTarget.textContent == "Update" ) {
        	msg.id = this.state.id;
	        msgcollection.update(msg).then(function(data) {
	        	console.log("DATA:"+data.id);
	            self.state.msgid = data.id;
	            console.log("SET:"+self.state.msgid)
	            self.props.onchange();
	        })        	
        }

	},
    
	handleSend: function() {
		console.log("Send");
	    console.log(this.state.value);
		fetch('http://localhost:3010/mail', { method: "GET" });
	},       
    
	render: function() {
		var change = (name, value) => this.setState({
	        ['value' + name]: value
	    });

	    if (this.props.data && this.props.data.id != this.state.id) {
	    	this.state.value = this.props.data.message;
	    	this.state.toemail = this.props.data.recipient;
	    	this.state.subject = this.props.data.subject;
	    	this.state.value0 = this.props.data.schedule;
	    	this.state.id = this.props.data.id;
		    this.setState({ shownid: this.props.data.id });
	    }

	    var sty={
	    	display:'block',
	    	width:700,
	    	height:260
	    }

        var sty2={
        	textAllign:'right'
        }

        return <div style={sty}>                  
                  <ReactQuill theme={this.state.theme}
					value={ this.state.value }
					readOnly={ this.state.readOnly }
					onChange={ this.onEditorChange }
					placeholder="Whats on your mind?"					
					onChangeSelection={ this.onEditorChangeSelection } />
				   <table className="myClassname">
				       <tbody>
				          <tr>  
                            <td style={{textAlign:'right'}}>Email Address</td>
                            <td>
                              <textarea style={{display:'block',width:200,height:30}}>
                                  { this.state.toemail }
                              </textarea>
                            </td>
                          </tr>
                          <tr>
                            <td  style={{textAlign:'right'}}>Subject</td>
                            <td>
                              <textarea style={{display:'block',width:200,height:30}}>
                                  { this.state.subject }
                              </textarea>
                            </td>
                          </tr>
                          <tr>
                              <td  style={{textAlign:'right'}}>Delivery Schedule:</td>
                              <td><DateTimePicker name='date' value={new Date(this.state.value0)} onChange={change.bind(null,'0')}/></td>
                          </tr>
				       </tbody>
				   </table>
				   <hr></hr>
				   <button className="actionbutton" onClick={this.handleClick}>Cancel</button>
				   <button className="actionbutton" onClick={this.handleClick}>Update</button>
				   <button className="actionbutton" onClick={this.handleClick}>Insert</button>
				   <button className="actionbutton" onClick={this.handleClick}>Send</button>			   
               </div>
	},
    
	renderToolbar: function() {
		var state = this.state;
		var enabled = state.enabled;
		var readOnly = state.readOnly;
		var selection = this.formatRange(state.selection);
                return <div>
                       <button onClick={this.onToggle}>{enabled ? 'Disable' : 'Enable'}</button>
                       <button onClick={this.onToggleReadonly}>{'Set '+ (readOnly? 'read/write' : 'read-only')}</button>
                       <button disabled='true'>{'Selection: ('+selection+')'}></button>
                       </div>
	},

});
