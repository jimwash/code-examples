/* global React */
/* global ReactQuill */
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DateTimePicker = ReactWidgets.DateTimePicker;

var Editor = React.createClass({
	displayName: 'Editor',

	getInitialState: function getInitialState() {
		return {
			shownid: -1,
			theme: 'snow',
			enabled: true,
			readOnly: false,
			value: '',
			events: []
		};
	},

	setMessage: function setMessage(message) {
		this.setState({ subject: message.subject, value: message.message, toemail: message.toemail, value0: message.schedule });
		this.render();
	},

	formatRange: function formatRange(range) {
		return range ? [range.start, range.end].join(',') : 'none';
	},

	toemail: '',

	onTextareaChange: function onTextareaChange(event) {
		var value = event.target.value;
		this.setState({ value: value });
	},

	onSubjectTextareaChange: function onSubjectTextareaChange(event) {
		var value = event.target.value;
		this.setState({ subject: value });
	},

	onEmailTextareaChange: function onEmailTextareaChange(event) {
		var value = event.target.value;
		this.setState({ toemail: value });
	},

	onEditorChange: function onEditorChange(value, delta, source) {
		this.setState({
			value: value,
			events: ['text-change(' + this.state.value + ' -> ' + value + ')'].concat(this.state.events)
		});
	},

	onEditorChangeSelection: function onEditorChangeSelection(range, source) {
		this.setState({
			selection: range,
			events: ['selection-change(' + this.formatRange(this.state.selection) + ' -> ' + this.formatRange(range) + ')'].concat(this.state.events)
		});
	},

	onToggle: function onToggle() {
		this.setState({ enabled: !this.state.enabled });
	},

	onToggleReadOnly: function onToggleReadOnly() {
		this.setState({ readOnly: !this.state.readOnly });
	},

	handleClick: function handleClick(elem) {
		console.log(this.state.value);
		var msg = new Message(this.state.value, this.state.toemail, this.state.subject, this.state.value0);
		var msgcollection = new Messages();
		var self = this;
		if (elem.currentTarget.textContent == "Insert") {
			msgcollection.insert(msg).then(function (data) {
				console.log("DATA:" + data.id);
				self.state.msgid = data.id;
				console.log("SET:" + self.state.msgid);
				self.props.onchange();
			});
		} else if (elem.currentTarget.textContent == "Update") {
			msg.id = this.state.id;
			msgcollection.update(msg).then(function (data) {
				console.log("DATA:" + data.id);
				self.state.msgid = data.id;
				console.log("SET:" + self.state.msgid);
				self.props.onchange();
			});
		}
	},

	handleSend: function handleSend() {
		console.log("Send");
		console.log(this.state.value);
		fetch('http://localhost:3010/mail', { method: "GET" });
	},

	render: function render() {
		var _this = this;

		var change = function change(name, value) {
			return _this.setState(_defineProperty({}, 'value' + name, value));
		};

		if (this.props.data && this.props.data.id != this.state.id) {
			this.state.value = this.props.data.message;
			this.state.toemail = this.props.data.recipient;
			this.state.subject = this.props.data.subject;
			this.state.value0 = this.props.data.schedule;
			this.state.id = this.props.data.id;
			this.setState({ shownid: this.props.data.id });
		}

		var sty = {
			display: 'block',
			width: 700,
			height: 260
		};

		var sty2 = {
			textAllign: 'right'
		};

		return React.createElement(
			'div',
			{ style: sty },
			React.createElement(ReactQuill, { theme: this.state.theme,
				value: this.state.value,
				readOnly: this.state.readOnly,
				onChange: this.onEditorChange,
				placeholder: 'Whats on your mind?',
				onChangeSelection: this.onEditorChangeSelection }),
			React.createElement(
				'table',
				{ className: 'myClassname' },
				React.createElement(
					'tbody',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ style: { textAlign: 'right' } },
							'Email Address'
						),
						React.createElement(
							'td',
							null,
							React.createElement(
								'textarea',
								{ style: { display: 'block', width: 200, height: 30 } },
								this.state.toemail
							)
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ style: { textAlign: 'right' } },
							'Subject'
						),
						React.createElement(
							'td',
							null,
							React.createElement(
								'textarea',
								{ style: { display: 'block', width: 200, height: 30 } },
								this.state.subject
							)
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ style: { textAlign: 'right' } },
							'Delivery Schedule:'
						),
						React.createElement(
							'td',
							null,
							React.createElement(DateTimePicker, { name: 'date', value: new Date(this.state.value0), onChange: change.bind(null, '0') })
						)
					)
				)
			),
			React.createElement('hr', null),
			React.createElement(
				'button',
				{ className: 'actionbutton', onClick: this.handleClick },
				'Cancel'
			),
			React.createElement(
				'button',
				{ className: 'actionbutton', onClick: this.handleClick },
				'Update'
			),
			React.createElement(
				'button',
				{ className: 'actionbutton', onClick: this.handleClick },
				'Insert'
			),
			React.createElement(
				'button',
				{ className: 'actionbutton', onClick: this.handleClick },
				'Send'
			)
		);
	},

	renderToolbar: function renderToolbar() {
		var state = this.state;
		var enabled = state.enabled;
		var readOnly = state.readOnly;
		var selection = this.formatRange(state.selection);
		return React.createElement(
			'div',
			null,
			React.createElement(
				'button',
				{ onClick: this.onToggle },
				enabled ? 'Disable' : 'Enable'
			),
			React.createElement(
				'button',
				{ onClick: this.onToggleReadonly },
				'Set ' + (readOnly ? 'read/write' : 'read-only')
			),
			React.createElement(
				'button',
				{ disabled: 'true' },
				'Selection: (' + selection + ')',
				'>'
			)
		);
	}

});

