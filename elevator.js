/* jshint esversion: 6 */

var Directions = {
	UP : 0,
	DOWN : 1,
	STANDING : 2,
};

var STOPPEDTIME = 2000;  // simulate waiting when stopped
var MOVINGTIME = 1000;   // simulate time to get to next floor

// Elevator Struction
//
// There are 2 separate array for upstops and downstops
// the idea being that a person looking to go down can avoid the ride up first
//
var Elevator = function (name, floor, direction, min_floor, max_floor, inservice=true) {
	this.name = name;
	this.floor = floor;
	this.direction = direction;
	this.inservice = inservice;
	this.min_floor = min_floor;
	this.max_floor = max_floor;
	this.downstops = [];
	this.upstops = [];

    // create the shaft the elevator will be in
    var elev = $("#elevators");
    this.div = "<div class='shaft' id='"+this.name+"'><div>";
    elev.append(this.div);
    
    // add a drawing area to the shaft
	var svg = d3.select("#"+this.name)
	.append("svg")
	.attr("width", "100%")
	.attr("height", "100%");

    this.svg = svg;
    this.stopped = false;
    this.draw();
};

// Draw the elevator
// Display witha fill if it stops
Elevator.prototype.draw = function() {
	 var shaftheight = $("#elevators").height();
     var height = shaftheight / this.max_floor;
     this.svg.selectAll("*").remove();
     var drawfloor = this.floor;
     if (drawfloor === 0) {
     	drawfloor = 1;
     }
     var y = shaftheight - (height*drawfloor);

     var fill = 'none';
     if (this.stopped) {
     	fill = 'green';
     }

     this.svg.append("rect")
      .style('fill',fill)
      .style('stroke','black')
      .style('stroke-width','1px')
      .attr("x", 0+"px")
      .attr("y", y+"px")
      .attr("width","100%")
      .attr("height",height+"px");
};

// Process request for a particular elevator
Elevator.prototype.addstop = function(direction, floor) {

	// If the elevator is in a standing State, it's got no where to go
	// and can choose the direction based on the floor to go to
	// if the floor is equal direction doesn't matter (pick one)
	if (this.direction == Directions.STANDING) {
		if (floor > this.floor) {
			this.direction = Directions.UP;
			this.upstops.push(floor);
			this.upstops.reverse();
		} else if (floor <= this.floor) {
			this.direction = Directions.DOWN;
			this.downstops.push(floor);
			this.downstops.sort();
		}
	} else if (direction == Directions.DOWN) {
		this.downstops.push(floor);
		this.downstops.sort();
	} else if (direction == Directions.UP) {
		this.upstops.push(floor);
		this.upstops.reverse();
	}

	console.log("Result = Direction:" + this.direction + " up:" + this.upstops.length + " down:" + this.downstops.length);
};

// Probably Elevator would make this determinatin itself
// place holder
Elevator.prototype.makestop = function(direction, floor) {
	if (direction == Directions.DOWN) {
		this.downstops.pop();
	} else if (direction == Directions.UP) {
		this.upstops.pop();
	}
};


// Start the elevator operation, controller by calling addstop
// the addstop will be call bu am outside source (elevator bank, elevator passenger)
Elevator.prototype.simulate = function() {

	var waittime = MOVINGTIME;
	this.stopped = false;

    // Go to next stop following current direction
    // If there are no stops in that direction then
    // switch direction if there are stops in the other direction
	if (this.direction == Directions.DOWN) {
		if (this.downstops.length > 0) {
			if (this.downstops[this.downstops.length - 1] > this.floor) {
				this.floor++;
			} else {
				this.floor--;
			}
			if (this.downstops[this.downstops.length - 1] == this.floor) {
				this.downstops.pop();
				this.stopped = true;
				waittime = STOPPEDTIME;
			}
			if (this.floor == this.min_floor) {
				this.direction = Directions.UP;
			}
		} else if (this.upstops.length > 0) {
			this.direction = Directions.UP;
		} else {
			this.direction = Directions.STANDING;
		}
	} else if (this.direction == Directions.UP) {
		if (this.upstops.length > 0) {
			if (this.upstops[this.upstops.length - 1] < this.floor) {
				this.floor--;
			} else {
				this.floor++;
			}
			if (this.upstops[this.upstops.length - 1] == this.floor) {
				this.upstops.pop();
				waittime = STOPPEDTIME;
				this.stopped = true;
			}
			if (this.floor >= this.max_floor) {
				this.direction = Directions.DOWN;
			}
		} else if (this.downstops.length > 0) {
			this.direction = Directions.DOWN;
		} else {
			this.direction = Directions.STANDING;
		}
	} else {
		if (this.upstops.length > 0) {
			this.direction = Directions.UP;
		} else if (this.downstops.length > 0) {
			this.direction = Directions.DOWN;
		}
	}

	var self = this;
	this.draw();
	if (this.stopped) {
		console.log("STOPPED AT:"+this.floor);
	}

	setTimeout(function() {
		self.simulate();
	}, waittime);
};

// Bank of Elevators, make it a class like thing to add operations on it
// Maybe have it report out of service elevators
function ElevatorBank() {
}

ElevatorBank.prototype = Object.create(Array.prototype);
ElevatorBank.prototype.simulate = function() {
	this.forEach(function(elevator, index) {
		elevator.simulate();
	});
};


// Process a request to the elevator bank, this involves figuring out which
// elevator to add the request too
ElevatorBank.prototype.processRequest = function(direction, floor) {

	console.log("Request: drection:"+direction+"  floor:"+floor);

	var chosenindex = -1;

    // default to the one with the smallest queue
	var smallest = null;
	var smallestidx = 0;

	for (var i=0;i<this.length;i++) {
		// Number of stops ?
        var sz = 0;

        // Distance between this floor and other stops (worse case)
        if (this[i].downstops.length > 0) {
        	sz+=Math.abs(this[i].downstops[this[i].downstops.length-1] - floor);
        }
        if (this[i].upstops.length > 0) {
            sz+=Math.abs(this[i].upstops[this[i].upstops.length-1] - floor);
        }

        console.log("I:"+i+" depth:"+sz+" smallest:"+smallest);

        if (smallest === null || sz < smallest) {
        	smallest = sz;
        	smallestidx = i;
        }
	}

	var closestindex = smallestidx;

	var self = this;
	this.forEach(function(elevator, index) {
		if (elevator.min_floor > floor || elevator.max_floor < floor) {
			console.log("OUT OF RANGE");
			return;
		}

		if (!elevator.inservice) {
			console.log("OUT OF SERVICE");
			return;
		}

// 		var onTheWay = ((elevator.direction === Directions.UP && elevator.floor < floor) || (elevator.direction === Directions.DOWN && elevator.floor > floor) || elevator.direction === Directions.STANDING );

		var distance = Math.abs(floor - elevator.floor);

		var furthestfloor;

		if (self[closestindex.direction] == Directions.UP)  {
		  var up = self[closestindex].upstops;
          furthestfloor = up[0];
		} else {
		  var down = self[closestindex].downstops;
		  furthestfloor = down[0];
		}

/*
		if (onTheWay && (chosenindex === -1 || distance < Math.abs(floor - self[chosenindex].floor))) {
			chosenindex = index;
		} else  if (onTheWay && distance < Math.abs(floor - self[closestindex].floor)) {
			closestindex = index;
		}
*/

		if (distance < Math.abs(floor - furthestfloor)) {
			closestindex = index;
		}
	});

	console.log("closestindex:" + closestindex);
	console.log("chosenindex:" + chosenindex);

    // var elevatorindex = chosenindex !== -1 ? chosenindex : closestindex;
	var elevatorindex = closestindex;

	this[elevatorindex].addstop(direction, floor);

	return elevatorindex;
};

module.exports.Elevator = Elevator;
module.exports.ElevatorBank = ElevatorBank;
module.exports.Directions = Directions; 