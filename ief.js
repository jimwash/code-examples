var intarray = (function() {
	var msg = "in there";
	var _printmsg = function() {
		console.log(msg)
	}
	return {
		printmsg: _printmsg
	}
}())

intarray.printmsg()
