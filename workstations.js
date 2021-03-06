/*
Given the following

Orders are placed as a set of “rows” in an order indicating:
Which cards are being built,
How many of those cards, and
The priority of those cards (0 being the highest priority)
The rows are sent in no particular order though orders should be processed sequentially
E.g. a single order might look like {“order”: 1, “rows” : [{“cardid”: 200, “quantity”: 100, “priority”: 5},
{“cardid”: 210, “quantity”: 75, “priority”: 8}, {“cardid”: 220, “quantity”: 150, “priority”: 1}] }.
For this order we should process card 220, followed by card 200, followed by card 210.
You can change the structure/values in this data structure if you’d like.

Each card is always made from the same set of “parts” which consist of multiple variants of paper and adhesive
you can define exactly what this means, but simple please)
The manufacturing process proceeds in steps which occur in the following order:
Select paper from the stock,
Lasercut the paper into card components
Assemble the sculptural components
Glue the completed sculpture and card pieces together into a finished card
Pack and mail the cards
These tasks are performed by “workstations"
There may be one or more of each workstation but all the stations of a similar type take the same amount of time
(which can be represented in “ticks”)
When working through an order, in priority order, each order line should be moved completely into a manufacturing
step before the next item in the order (and the last line in the previous order before the first in the next).
It is okay for different stations of the same type to process different cards but the same station can only process one card at a time
So for instance, if we had order 1 with lines A B C (in priority order) and the “select paper” step has 3 stations s1,s2,and s3 it is
possible for s1 and s2 to be working on A and s3 on B if s1 and s2 have sufficient capacity to process A entirely
and s3 has sufficient capacity to process B entirely. If s3 does not, have enough capacity B must wait until enough stations
finish with A to create the capacity.
Make sure you have enough capacity to handle the maximum number of cards you specify for an order line (e.g. no
order should ever have enough cards to overwhelm ALL the stations at any step). This also means stations may have
to go underutilized waiting for the capacity to open up to process the next task. That is fine.
*/

// This is a simplified solution
//
// It wasn't clear what the following mean

//   Make sure you have enough capacity to handle the maximum number of cards you specify for an order line (e.g. no
//   order should ever have enough cards to overwhelm ALL the stations at any step). This also means stations may have
//   to go underutilized waiting for the capacity to open up to process the next task. That is fine.

// It doesn't handle the following again I wasn't sure what it was asking for

//   Each card is always made from the same set of “parts” which consist of multiple variants of paper and adhesive
//   you can define exactly what this means, but simple please)

// card orders
var OrderRow = function(id, quantity, priority) {
	this.cardid = id;
	this.quantity = quantity;
	this.priority = priority;
};

// Orders are made up of order rows
var Order = function(id, rows) {
	this.order = id;
	this.rows = rows;

	// order rows by priotiy
	this.rows.sort(function(row1, row2) {
		return row1.priority - row2.priority;
	});
};

// Workstations are defined by their manaufacturing step
// that step is defined by it's execution time
//
// Workstation also have a state to reflect their availability
var WorkStation = function(typetask, name, ticks) {
	this.type = typetask;
	this.name = name;
	this.ticks = ticks;
	this.active = false;
};

WorkStation.prototype.process = function(cardid) {
	// reflect it's state
	this.active = true;
	console.log("Start Type:" + this.type + ":" + cardid + ":" + this.ticks);

	var self = this;
	return new Promise(function(resolve, reject) {
		// A mock async action using setTimeout
		setTimeout(function() {
			self.active = false;
			resolve(cardid);
		}, self.ticks);
	});
};

// manage all stations of a particular type
function Stations(type) {
	this.type = type;
	Array.call(this);
	this.queue = [];
	this.cardqueue = [];
	this.max = 0;
}

Stations.prototype = Object.create(Array.prototype);

// Add this row to the station
Stations.prototype.addToQueue = function(row, assignC) {
	this.queue.push({
		"row" : row,
		"completed" : 0
	});
	this.max++;
	for (var i = 0; i < row.quantity; i++) {
		this.cardqueue.push(row.cardid);
		this.assignCards();
	}
};

// each time a card completes at the station check for next stepps
// either continue processing all other cards for this stations
//
// or if complete then move on to the next station
//
Stations.prototype.cardComplete = function(id) {
	// set completed count add to queue of next
	console.log("TYPE:"+this.type);
	for (var i = 0; i < this.queue.length; i++) {
		if (this.queue[i].row.cardid == id) {
			console.log("id:"+id+" i:"+i);
			this.queue[i].completed++;

			console.log("completed:"+this.queue[i].completed);
			console.log("quantity:"+this.queue[i].row.quantity);
			if (this.queue[i].completed == this.queue[i].row.quantity) {
				console.log(i + ":" + this.type + ":" + "finished with:" + this.queue[i].row.cardid);
				var row = this.queue[i].row;
				this.queue.splice(i, 1);
                console.log("this queue:"+this.queue.length);
				if (this.next) {
					this.next.addToQueue(row);
					this.next.assignCards();
				}

				break;
			}
		}
	}

	this.assignCards();
};

// Assign cards to any open stations
Stations.prototype.assignCards = function() {
	var self = this;
	this.forEach(function(elem, idx) {
		if (elem.active === false) {
			if (self.cardqueue.length > 0) {
				console.log("PROCESS:" + elem.type + ": Card:" + self.cardqueue[0]);
				var cardid = self.cardqueue[0];
				elem.process(cardid).then(function(cid) {
					self.cardComplete(cid);
				});
				self.cardqueue.splice(0, 1);
			}
		}
	});

};

// Responsible for creating all the workstations for a particular type
//
var WorkStationFactory = function() {
};

WorkStationFactory.prototype.createWorkstations = function(numberof, type, prefix, ticks) {
	var stations = new Stations(type);
	for (var i = 0; i < numberof; i++) {
		stations.push(new WorkStation(type, prefix + i, ticks));
	}
	return stations;
};

// Control numer of stations and set the next stage for each station
function StationsControl() {
	// factory for creating work stations
	var factory = new WorkStationFactory();

	// Different workstation configuration for testing
	/*
	 this.selects = factory.createWorkstations(40,'Select',"s",10);
	 this.cuts = factory.createWorkstations(50,'Cut','c',20);
	 this.assembles = factory.createWorkstations(30,'Assemble','a',20)
	 this.glues = factory.createWorkstations(30,'Glue', 'g',30)
	 this.packandmails = factory.createWorkstations(30,'Pack and Mail','pm',40)
	 */

	this.selects = factory.createWorkstations(2, 'Select', "s", 2010);
	this.cuts = factory.createWorkstations(3, 'Cut', 'c', 2020);
	this.assembles = factory.createWorkstations(3, 'Assemble', 'a', 2020);
	this.glues = factory.createWorkstations(3, 'Glue', 'g', 2030);
	this.packandmails = factory.createWorkstations(3, 'Pack and Mail', 'pm', 2040);

	this.selects.next = this.cuts;
	this.cuts.next = this.assembles;
	this.assembles.next = this.glues;
	this.glues.next = this.packandmails;
	this.packandmails.next = null;
}

StationsControl.prototype.addOrder = function(order) {
	this.order = order;

	// Add order to selects, direct it
	for (var i = 0; i < order.rows.length; i++) {
		console.log("ID:" + order.rows[i].cardid);
		this.selects.addToQueue(order.rows[i], true);
	}
};

StationsControl.prototype.status = function(order) {
	var ret = {};
	ret.select_quantity = this.selects.queue.length;
	ret.select_completed = this.selects.max - this.selects.queue.length;
	console.log("selects:"+this.selects.queue.length);
	if (this.selects.queue.length > 0) {
		ret.select_cards_completed = 0;
		ret.select_cards_quantity = 0;
		for (var i=0;i<this.selects.queue.length;i++) {
		    ret.select_cards_completed += this.selects.queue[0].completed;
		    ret.select_cards_quantity += this.selects.queue[0].row.quantity;
	    }
	}

	console.log("cuts:"+this.cuts.queue.length);
	ret.cut_quantity = this.cuts.queue.length;
	ret.cut_completed = this.cuts.max - this.cuts.queue.length;
	if (this.cuts.queue.length > 0) {
		ret.cut_cards_completed = 0;
		ret.cut_cards_quantity = 0;
		for (var i=0;i<this.cuts.queue.length;i++) {
		    ret.cut_cards_completed += this.cuts.queue[0].completed;
		    ret.cut_cards_quantity += this.cuts.queue[0].row.quantity;
	    }
	}

	console.log("assembles:"+this.assembles.queue.length);
	ret.assemble_quantity = this.assembles.queue.length;
	ret.assemble_completed = this.assembles.max - this.assembles.queue.length;
	if (this.assembles.queue.length > 0) {
		ret.assemble_cards_completed = 0;
		ret.assemble_cards_quantity = 0;
		for (var i=0;i<this.assembles.queue.length;i++) {
		    ret.assemble_cards_completed += this.assembles.queue[0].completed;
		    ret.assemble_cards_quantity += this.assembles.queue[0].row.quantity;		
	    }
	}


	console.log("glues:"+this.glues.queue.length);

	ret.glue_quantity = this.glues.queue.length;
	ret.glue_completed = this.glues.max - this.glues.queue.length;
	if (this.glues.queue.length > 0) {
		ret.glue_cards_completed = 0;
		ret.glue_cards_quantity = 0;
		for (var i=0;i<this.glues.queue.length;i++) {
			ret.glue_cards_completed += this.glues.queue[0].completed;
			ret.glue_cards_quantity += this.glues.queue[0].row.quantity;	
		}		
	}
	
	console.log("packandmails:"+this.packandmails.queue.length);
	ret.packandmail_quantity = this.packandmails.queue.length;
	ret.packandmail_completed = this.packandmails.max - this.packandmails.queue.length;
	if (this.packandmails.queue.length > 0) {
		ret.packandmail_cards_completed = 0;
		ret.packandmail_cards_quantity = 0;
		for (var i=0;i<this.packandmails.queue.length;i++) {		
			ret.packandmail_cards_completed += this.packandmails.queue[0].completed;
			ret.packandmail_cards_quantity += this.packandmails.queue[0].row.quantity;
		}					
	}

	
    return ret;
};

// Test Data
// var orderrows = [new OrderRow(200, 100, 5), new OrderRow(210, 75, 8), new OrderRow(220, 150, 1)];

// Test Data for debugging
//var orderrows1 = [new OrderRow(200, 1, 5), new OrderRow(210, 5, 8), new OrderRow(220, 6, 1)];

// Create the order
//var order = new Order(1, orderrows1);

// Setup the stations
//var stationcontroller = new StationsControl();

// Add the order to the stations
//stationcontroller.addOrder(order); 

module.exports.Order = Order;
module.exports.OrderRow = OrderRow;
module.exports.StationsControl = StationsControl; 