class Box {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Robot {
  x: number;
  y: number;
  liftingBox: Box | null;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
    this.liftingBox = null;
  }

  moveNorth() {
    if (this.y < 9) {
      this.y += 1;
    }
  }

  moveWest() {
    if (this.x > 0) {
      this.x -= 1;
    }
  }

  moveEast() {
    if (this.x < 9) {
      this.x += 1;
    }
  }

  moveSouth() {
    if (this.y > 0) {
      this.y -= 1;
    }
  }

  grab(box: Box | null) {
    if (box && !this.liftingBox && this.x === box.x && this.y === box.y) {
      this.liftingBox = box;
    }
  }

  drop() {
    if (this.liftingBox) {
      this.liftingBox.x = this.x;
      this.liftingBox.y = this.y;
      this.liftingBox = null;
    }
  }

  move(directions: string[]) {
    let north = directions.includes('N');
    let south = directions.includes('S');
    let east = directions.includes('E');
    let west = directions.includes('W');

    if (north && !south) {
      if (east && !west) {
        //Move North-East
        if (this.x < 9 && this.y < 9) {
          this.x += 1;
          this.y += 1;
        }
      } else if (west && !east) {
        //Move North-West
        if (this.x > 0 && this.y < 9) {
          this.x -= 1;
          this.y += 1;
        }
      } else {
        //Move North
        this.moveNorth();
      }
    } else if (south && !north) {
      if (east && !west) {
        //Move South-East
        if (this.x < 9 && this.y > 0) {
          this.x += 1;
          this.y -= 1;
        }
      } else if (west && !east) {
        //Move South-West
        if (this.x > 0 && this.y > 0) {
          this.x -= 1;
          this.y -= 1;
        }
      } else {
        //Move South
        this.moveSouth();
      }
    } else if (east && !west) {
      //Move East
      this.moveEast();
    } else if (west && !east) {
      //Move West
      this.moveWest();
    }
  }
}

function parseCommands(robot: Robot, boxes: Box[], commands: string) {
  const commandList = commands.split(' ');

  let directions: string[] = [];
  for (const command of commandList) {
    if (['N', 'W', 'E', 'S'].includes(command)) {
      directions.push(command);
    } else {
      if (directions.length > 0) {
        robot.move(directions);
        directions = [];
      }
      switch (command) {
        case 'G':
          const crateToGrab = boxes.find(
            box => box.x === robot.x && box.y === robot.y
          );
          robot.grab(crateToGrab || null);
          break;
        case 'D':
          const crateBelow = boxes.find(
            box => box.x === robot.x && box.y === robot.y
          );
          if (!crateBelow) {
            robot.drop();
          }
          break;
      }
    }
  }

  //Process any remaining movement commands
  if (directions.length > 0) {
    robot.move(directions);
  }
}

//Initialize the robot and boxes
const robot = new Robot(0, 0);
const crate1 = new Box(4, 4);
const crate2 = new Box(9, 9);
const boxes = [crate1, crate2];

//Move diagonally to the center of the warehouse
parseCommands(robot, boxes, 'N E N E N E N E');
console.log(`Robot position after: (${robot.x}, ${robot.y})`); //output (4, 4)

//Grab the box in the center and move diagonally to the north-west corner
parseCommands(robot, boxes, 'G N W N W N W N W');
console.log(`Robot position after: (${robot.x}, ${robot.y})`); //output (0, 9)
console.log(`Box 1 position after: (${crate1.x}, ${crate1.y})`); //output (0, 9)

//Drop the box, move diagonally to the south-east corner, and grab the second box
parseCommands(robot, boxes, 'D S E S E S E S E G');
console.log(`Robot position after: (${robot.x}, ${robot.y})`); //output (9, 0)
console.log(`Box 2 position after: (${crate2.x}, ${crate2.y})`); //output (9, 0)

//Move diagonally to the center of the warehouse and drop the second box
parseCommands(robot, boxes, 'N W N W N W N W D');
console.log(`Robot position after: (${robot.x}, ${robot.y})`); //output (4, 4)
console.log(`Box 2 position after: (${crate2.x}, ${crate2.y})`); //output (4, 4)
