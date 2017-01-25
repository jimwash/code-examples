var ExtArray =  function(origarray) {
	this.myarray = origarray;
}

ExtArray.prototype.finddupes = function() {
   var map = {}
   var ret = []
   for (i=0;i<this.myarray.length;i++) {
   	  var elem = this.myarray[i]
   	  if (map[elem]) {
   	  	ret.push(elem)
   	  } else {
   	  	map[elem] = 1
   	  }
   }
   return ret
}

var intarray = new ExtArray([1,2,3,2]);
var dupes = intarray.finddupes();
console.log(dupes);
