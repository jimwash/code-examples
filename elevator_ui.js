// var ev = require("./elevator.js")

elevatorbank = new ElevatorBank;

// Elevators at initial positions
// elevatorbank.push(new ev.Elevator("L1",3,ev.Directions.DOWN,0,20))
// elevatorbank.push(new ev.Elevator("L2",4,ev.Directions.STANDING,0,20))
// elevatorbank.push(new ev.Elevator("R1",3,ev.Directions.UP,0,20,false))
// elevatorbank.push(new ev.Elevator("R2",7,ev.Directions.STANDING,0,20))

elevatorbank.push(new Elevator("L1",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L2",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("R1",0,Directions.STANDING,0,20))


elevatorbank.push(new Elevator("R2",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L3",0,Directions.STANDING,0,20))

/*
elevatorbank.push(new Elevator("R3",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L4",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("R4",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L5",0,Directions.STANDING,0,20))
*/


elevatorbank.processRequest(Directions.UP, 3)
elevatorbank.processRequest(Directions.UP, 4)
elevatorbank.processRequest(Directions.UP, 19)
elevatorbank.processRequest(Directions.UP, 17)
elevatorbank.processRequest(Directions.UP, 4)
elevatorbank.processRequest(Directions.UP, 6)
elevatorbank.processRequest(Directions.DOWN, 1)
elevatorbank.processRequest(Directions.DOWN, 2)
elevatorbank.processRequest(Directions.UP, 15)
elevatorbank.processRequest(Directions.DOWN, 8)
elevatorbank.processRequest(Directions.UP, 10)


elevatorbank.simulate()