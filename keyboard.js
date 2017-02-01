//
// Represents a row on a keyboard
function KeyboardRow() {
};
KeyboardRow.prototype = new Array;

// Can this string be typed using just this row
KeyboardRow.prototype.cantype = function(str) {
	var chars = str.toLowerCase().split('');
  var self = this;
	var notid = chars.filter( function( el ) {
	  return self.indexOf( el ) < 0;
	});
	return notid.length == 0;

}

// Construct the keyboard rows
var row1 = new KeyboardRow();
row1.push('q','w','e','r','t','y','u','i','o','p')

var row2 = new KeyboardRow();
row2.push('a','s','d','f','g','h','j','k','l')

var row3 = new KeyboardRow();
row3.push('z','x','c','v','b','n','m')

var keyboard = [ row1, row2, row3 ]

var cantypewords = []
var checkwords = ["Hello", "Alaska", "Dad", "Peace"]

checkwords.forEach(function(word,i){
   keyboard.forEach(function(row,rownum){
   	  if (row.cantype(word)) {
   	  	cantypewords.push(word)
   	  }
   })
})

console.log("Can type")
cantypewords.forEach(function(word,i) {
    console.log(word)
})