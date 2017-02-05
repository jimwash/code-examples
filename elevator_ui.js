
elevatorbank = new ElevatorBank;

elevatorbank.push(new Elevator("L1",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L2",0,Directions.STANDING,10,20))
elevatorbank.push(new Elevator("R1",0,Directions.STANDING,10,20))
elevatorbank.push(new Elevator("R2",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("L3",0,Directions.STANDING,0,20))
elevatorbank.push(new Elevator("R3",0,Directions.STANDING,0,20))


elevatorbank.processRequest(Directions.UP, 3);
elevatorbank.processRequest(Directions.UP, 4);
elevatorbank.processRequest(Directions.UP, 19);
elevatorbank.processRequest(Directions.UP, 17);
elevatorbank.processRequest(Directions.UP, 14);
elevatorbank.processRequest(Directions.UP, 11);
elevatorbank.processRequest(Directions.UP, 12);
elevatorbank.processRequest(Directions.UP, 13);
elevatorbank.processRequest(Directions.UP, 6);
elevatorbank.processRequest(Directions.DOWN, 1);
elevatorbank.processRequest(Directions.DOWN, 2);
elevatorbank.processRequest(Directions.UP, 15);
elevatorbank.processRequest(Directions.DOWN, 8);
elevatorbank.processRequest(Directions.UP, 10);
elevatorbank.processRequest(Directions.DOWN,7);
elevatorbank.processRequest(Directions.DOWN,5);
elevatorbank.processRequest(Directions.UP, 16);
elevatorbank.processRequest(Directions.DOWN, 18);
elevatorbank.processRequest(Directions.UP, 9);

elevatorbank.simulate()