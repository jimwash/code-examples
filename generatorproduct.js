/*
Now, we have some products that are called generator products i.e. when a person buys this product, he is more likely to buy other stuff too.

Consider this order:

Product1 -- Price = 2

Product2 -- Price = 5

Product3 -- Price = 3

 

Now the generator function is:

g(Product1) = 5+3 = 8

g(Product2) = 2+3 = 5

g(Product3) = 5+2

 

We want to go over all the orders placed in the history of this company and find the product that has the maximum generator value.

---- The thing to remember here is that we are not looking for the max per order, we want to sum up the generator values for each product across all orders and then sort the resulting list.

---- Use a Dictionary to store unique products and their generator value (and for every order, keep adding the generator value)

---- Sort the dictionary to get the max
*/

// The collection of all the orders (order history)
function OrderHistory() {
	this.orders = [];
}

// A particular order
function Order(orderitems) {
	this.orderitems = orderitems;
	this.ordertotal = 0;
	var self = this;
	this.orderitems.forEach(function(elem,idx) {
		self.ordertotal += (elem.priceper*elem.quantity);
	});
}

// an item in an order
function OrderItem(productid, quantity, priceper) {
    this.productid = productid;
    this.quantity = quantity;
    this.priceper = priceper;
}


// Calculate top generators from order history
OrderHistory.prototype.generators = function() {
	var generatorvals = {};

    // Collect totals for each product as a generator
    // save the totals in a hashmap
    this.orders.forEach(function(elem,idx) {
     	elem.orderitems.forEach(function(itemelem,itemidx) {
     	   if (! (itemelem.productid in generatorvals) ) {
     	   	    generatorvals[itemelem.productid] = 0;
     	   }
           generatorvals[itemelem.productid] += elem.ordertotal - (itemelem.priceper*itemelem.quantity);
     	});
    });

    // Create an array of the generators and sort by total generated
    // the largest generator will be the first on the list
    var vals = [];
	for (var productid in generatorvals) {
	    item = {};
	    item.productid = productid;
	    item.total = generatorvals[productid];
	    vals.push(item);
	}

    vals.sort(function(a,b) {
    	return b.total - a.total;
    });

    return vals;
};

// Add an order to our collection of orders
OrderHistory.prototype.addOrder = function(order) {
	this.orders.push(order);
};



// Add orders to history and calculate the generators
var orders = new OrderHistory();

var orderitems1 = new Order([new OrderItem(1,1,40),new OrderItem(2,1,30), new OrderItem(4,1,10)]);
var orderitems2 = new Order([new OrderItem(1,1,40),new OrderItem(3,1,30), new OrderItem(5,2,10)]);

orders.addOrder(orderitems1);
orders.addOrder(orderitems2);

gens = orders.generators();

console.log("Top Generator   id:"+gens[0].productid+"  total generated:"+gens[0].total);
