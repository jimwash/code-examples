var ev = require("./elevator.js")

elevatorbank = new ev.ElevatorBank;

elevatorbank.push(new ev.Elevator("L1",3,ev.Directions.DOWN,0,20))
elevatorbank.push(new ev.Elevator("L2",4,ev.Directions.STANDING,0,20))
//elevatorbank.push(new ev.Elevator("R1",3,ev.Directions.UP,0,20,false))
//elevatorbank.push(new ev.Elevator("R2",7,ev.Directions.STANDING,0,20))

elevatorbank.processRequest(ev.Directions.UP, 4)
elevatorbank.processRequest(ev.Directions.UP, 6)

elevatorbank.processRequest(ev.Directions.DOWN, 1)
elevatorbank.processRequest(ev.Directions.DOWN, 2)


elevatorbank.simulate()