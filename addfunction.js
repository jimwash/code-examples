addme = function(a,b=null) {
    if (b != null) {
    	return a+b
    }

    return function(x) {
    	return x+a;
    }
}

console.log(addme(5,2));
console.log(addme(5)(3));