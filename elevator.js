var Directions = {
    UP: 0,
    DOWN: 1,
    STANDING: 2,
}


var Elevator = function(name,floor,direction,min_floor,max_floor,inservice=true) {
   this.name = name;
   this.floor = floor;
   this.direction = direction
   this.inservice = inservice
   this.min_floor = min_floor
   this.max_floor = max_floor
   this.downstops = []
   this.upstops = []
}


// Process request for a particular elevator
Elevator.prototype.addstop = function(direction,floor) {
    console.log("Given:"+direction+" : "+floor);
    console.log("Add stop to :"+this.name+"  Direction:"+this.direction+" Floor:"+this.floor);
    if (this.direction == Directions.STANDING) {
        if (floor > this.floor) {
          this.direction = UP;
          this.upstops.push(floor);
          this.upstops.sort();
        } else if (floor < this.floor) {
          this.direction = Directions.DOWN;
          this.downstops.push(floor)
          this.downstops.sort();
        }
    } else if (direction == Directions.DOWN) {
        this.downstops.push(floor)
        this.downstops.sort();
    } else if (direction == Directions.UP) {
        this.upstops.push(floor);
        this.upstops.sort();
    }
   
    console.log("Direction:"+this.direction+" up:"+this.upstops.length+" down:"+this.downstops.length);
}


// Probably Elevator would make this determinatin itself
Elevator.prototype.makestop = function(direction,floor) {
    if (direction ==Directions.DOWN) {
      this.downstops.pop()
    } else if (direction == Directions.UP) {
      this.upstops.pop()
    }
}

Elevator.prototype.simulate = function() {
    var waittime = 1000;
    console.log("At Start Elevator:"+this.name+" Direction:"+this.direction+" Floor:"+this.floor);
    console.log("Downstops:"+this.downstops.length);
    console.log("Upstops:"+this.upstops.length);
    if (this.direction == Directions.DOWN) {
      if (this.downstops.length > 0) {
          this.floor--;
          if (this.downstops[this.downstops.length-1] == this.floor) {
            this.downstops.pop()
            waittime = 2000;
          }
      } else if (this.upstops.length > 0) {
        this.direction = Directions.UP;
      } else {
        this.direction = Directions.STANDING;
      }
    } else if (this.direction == Directions.UP) {
      if (this.upstops.length > 0) {
        this.floor++;
        if (this.upstops[this.upstops.length-1] == this.floor) {
          this.upstops.pop()
          waittime = 2000;
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

    console.log("Elevator:"+this.name+" Direction:"+this.direction+" Floor:"+this.floor);
    var self = this;
    setTimeout(function(){self.simulate()},waittime);
}

// Bank of Elevators, make it a class like thing to add operations on it
// Maybe have it report out of service elevators

function ElevatorBank() {};
ElevatorBank.prototype = new Array;
ElevatorBank.prototype.simulate = function() {
    this.forEach(function(elevator,index) {
      elevator.simulate();
    })
}

ElevatorBank.prototype.processRequest = function (direction,floor) {
    console.log("direction:"+direction);
    console.log("floor:"+floor);
    var chosenindex = -1;
    var closestindex = Math.floor(Math.random() * elevatorbank.length);
    var self = this;
    this.forEach(function(elevator,index) {
        if (elevator.min_floor > floor || elevator.max_floor < floor) {
           console.log("OUT OF RANGE")
           return;
        }

        if (!elevator.inservice) {
           console.log("OUT OF SERVICE")
           return;
        }
        var onTheWay = (
          (elevator.direction === Directions.UP && elevator.floor < floor) ||
          (elevator.direction === Directions.DOWN && elevator.floor > floor) ||
           elevator.direction === Directions.STANDING ); 

        var sameDirection = direction === elevator.direction || 
                            elevator.direction === Directions.STANDING;
    
        var distance = Math.abs(floor - elevator.floor);
    
        if (onTheWay && sameDirection &&
           (chosenindex === -1 || 
            distance < Math.abs(floor - self[chosenindex].floor)) ) {
          chosenindex = index;
        }
    
        if (distance<Math.abs(floor-self[closestindex].floor)) {
          closestindex = index
        }
    })

    console.log("closestindex:"+closestindex); 
    console.log("chosenindex:"+chosenindex); 

    elevatorindex = chosenindex !== -1 ? chosenindex : closestindex;

    this[elevatorindex].addstop(direction,floor);

    return elevatorindex;
}

module.exports.Elevator = Elevator
module.exports.ElevatorBank = ElevatorBank
module.exports.Directions = Directions