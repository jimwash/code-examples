console.log("ABC")
var schedule = require('node-schedule');
var intarray = (function(sched) {
	var z = "in there";
	var x = function() {
		console.log(z)
	}
	console.log("In a")
	return {
		abcd: x
	}
}(schedule))

intarray.abcd()


var ExtArray =  function(origarray) {
	this.myarray = origarray;
}
ExtArray.prototype.finddupes = function() {
   var b = {}
   var ret = []
   for (i=0;i<this.myarray.length;i++) {
   	  x = this.myarray[i]
   	  if (b[x]) {
   	  // if (b.hasOwnProperty(x)) {
   	  	ret.push(x)
   	  } else {
   	  	b[x] = 1
   	  }
   }
   return ret
}

var xyz = new ExtArray([1,2,3,2]);
var dupes = xyz.finddupes();
console.log(dupes);