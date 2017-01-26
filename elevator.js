var Directions = {
    UP: 0,
    DOWN: 1,
    STANDING: 2,
}

// Elevator Struction
//
// There are 2 separate array for upstops and downstops 
// the idea being that a person looking to go down can avoid the ride up first
//
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
          this.downstops.push(floor)
          this.downstops.sort();
        }
    } else if (direction == Directions.DOWN) {
        this.downstops.push(floor)
        this.downstops.sort();
    } else if (direction == Directions.UP) {
        this.upstops.push(floor);
        this.upstops.reverse();
    }
   
    console.log("Result = Direction:"+this.direction+" up:"+this.upstops.length+" down:"+this.downstops.length);
}


// Probably Elevator would make this determinatin itself
// place holder
Elevator.prototype.makestop = function(direction,floor) {
    if (direction ==Directions.DOWN) {
      this.downstops.pop()
    } else if (direction == Directions.UP) {
      this.upstops.pop()
    }
}

// Start the elevator operation, controller by calling addstop
// the addstop will be call bu am outside source (elevator bank, elevator passenger) 
Elevator.prototype.simulate = function() {
    var waittime = 1000;
    console.log("At Start Elevator:"+this.name+" Direction:"+this.direction+" Floor:"+this.floor);
    console.log("Downstops:"+this.downstops.length);
    console.log("Upstops:"+this.upstops.length);
    if (this.direction == Directions.DOWN) {
      if (this.downstops.length > 0) {
          if (this.downstops[this.downstops.length-1] > this.floor) {
            this.floor++;
          } else {
            this.floor--;
          }
          if (this.downstops[this.downstops.length-1] == this.floor) {
            console.log("STOPPED 1 -------"+this.floor)
            this.downstops.pop()
            waittime = 2000;
          }
          if (this.floor == this.min_floor) {
            this.direction = Directions.UP
          }
      } else if (this.upstops.length > 0) {
        this.direction = Directions.UP;
      } else {
        this.direction = Directions.STANDING;
      }
    } else if (this.direction == Directions.UP) {
      if (this.upstops.length > 0) {
        if (this.upstops[this.upstops.length-1] < this.floor) {
          this.floor--;
        } else {
          this.floor++;
        }
        if (this.upstops[this.upstops.length-1] == this.floor) {
          console.log("STOPPED 2 ------"+this.floor)
          this.upstops.pop()
          waittime = 2000;
        }
        if (this.floor >= this.max_floor) {
          this.direction = Directions.DOWN
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

// Process a request to the elevator bank, this involves figuring out which 
// elevator to add the request too
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