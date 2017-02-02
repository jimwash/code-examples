var DeferredExt = function() {
};


DeferredExt.prototype.whenzer = function() {
	var res = [];
	var ret = $.Deferred();
	var count = 0;

	for (var idx=0;idx<arguments.length;idx++) {
		var elem = arguments[idx];
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
		    });
		})(idx)).fail(function(code) {
			console.log("REJECT");
            ret.reject(code);
            return;
		});
	}
	return ret;
};


// Just curious what size this gives?
var testarraysize = [];
testarraysize[2] = 4;
console.log("size:"+testarraysize.length);


var url1 = $.get("../index.html");
var url2 = $.get("../index2.html");


var dext = new DeferredExt();
dext.whenzer(url1,url2).then(function(dataarray) {
    console.log("THEN:"+dataarray.length);
}).fail(function(code) {
	console	.log("FAIL:"+code);
});