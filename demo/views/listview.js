"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LV = function (_React$Component) {
	_inherits(LV, _React$Component);

	function LV(contacts) {
		_classCallCheck(this, LV);

		var _this = _possibleConstructorReturn(this, (LV.__proto__ || Object.getPrototypeOf(LV)).call(this));

		_this.config = contacts;
		return _this;
	}

	_createClass(LV, [{
		key: "onclick",


		// an element in the list was clicked
		value: function onclick(elem) {
			callback(elem.target.id);
			$(".loopliactive").removeClass("loopliactive");
			$("#" + elem.target.id).parent().addClass("loopliactive");
		}
	}, {
		key: "listElements",
		value: function listElements() {
			var self = this;
			return this.config.contacts.filter(function (contact) {
				return contact.email;
			}).map(function (contact) {
				var clsname = "loopli";
				return React.createElement(
					"li",
					{ onClick: self.onclick, className: clsname },
					React.createElement(
						"div",
						{ id: contact.key },
						contact.name
					),
					React.createElement(
						"div",
						null,
						contact.email
					)
				);
			});
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"h1",
					{ className: "looph1" },
					"Loops"
				),
				React.createElement(
					"ul",
					null,
					" ",
					this.listElements(),
					" "
				)
			);
		}
	}]);

	return LV;
}(React.Component);

;

