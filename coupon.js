var CartItem = function(name, price, type) {
	this.price = price;
	this.type = type;
	this.coupons = [];
};

var Coupon = function(type, amount, itemtype, n) {
	this.type = type;
	/* P, N, D */
	this.amount = amount;
	this.itemtype = itemtype;
	this.n = n;
};

var Cart = function(items) {
	this.items = items;
};

Cart.prototype.applyCoupons = function() {
	var self = this;
	this.items.forEach(function(elem, idx) {
		var cartitem;
		var i;
		if ( elem instanceof Coupon) {
			if (elem.type == "P") {
				for ( i = 0; i < self.items.length; i++) {
					cartitem = self.items[i];
					if ( cartitem instanceof CartItem) {
						cartitem.coupons.push(elem);
					}

				}
			} else if (elem.type == "N") {
				for ( i = idx; i < self.items.length; i++) {
					cartitem = self.items[i];
					if ( cartitem instanceof CartItem) {
						cartitem.coupons.push(elem);
						break;
					}
				}
			} else {
				for ( i = 0; i < self.items.length; i++) {
					var typecount = 0;
					cartitem = self.items[i];
					if ( cartitem instanceof CartItem) {
						if (cartitem.type == elem.coupontype) {
							typecount++;
							if (elem.n == typecount) {
								cartitem.coupons.push(elem);
								break;
							}
						}
					}
				}
			}
		}
	});
};

Cart.prototype.total = function() {
	var total = 0;
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if ( item instanceof CartItem) {
			var price = item.price;
			for (var j = 0; j < item.coupons.length; j++) {
				var coupon = item.coupons[j];
				price = price - (price * coupon.amount);
			}

			total = total + price;
		}
	}

	console.log("Total:" + total);
};

var items = [new Coupon("N", ".05"), new CartItem("9 inch Pan", 19.99), new Coupon("A", 4.0, "Planter", 2), new CartItem("Planter", 10.00), new Coupon("P", "0.10"), new Coupon("Planter", 10.00)];

var cart = new Cart(items);
cart.applyCoupons();
cart.total(); 