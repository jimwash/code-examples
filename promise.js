

var DD = function() {

}

DD.prototype.whenzer = function() {
	var whens = [];
	var res = [];
	var ret = $.Deferred();
	var count = 0;

	console.log("ARG:"+arguments.length);

	for (var idx=0;idx<arguments.length;idx++) {
		var elem = arguments[idx];
		elem.eix = idx;
        var eix = idx;
 		elem.then((function(idx) {
 			return (
 			function(data) {
	            res[idx] = data;
	            count++;
	            if (count == arguments.length-1) {
	            	console.log("RESOLVE");
	            	ret.resolve(res);
	            	return;
	            }
		    })
		})(idx)).fail(function(code) {
			console.log("REJECT");
            ret.reject(code);
            return;
		})
	}
	return ret;
}

var t = [];
t[2] = 4;
console.log("T:"+t.length);

var a = $.get("../index.html")
var b = $.get("../index2.html")

var x = new DD();
x.whenzer(a,b).then(function(dx) {
    console.log("THEN:"+dx.length)
    //console.log(("D1:"+dx[0]))
    //console.log(("D2:"+dx[1]))
}).fail(function(code) {
	console	.log("FAIL:"+code)
})