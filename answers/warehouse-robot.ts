class Robot {
    x: number;
    y: number;
  
    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
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
}

function parseCommands(robot: Robot, commands: string) {
    const commandList = commands.split(' ');
  
    for (const command of commandList) {
      switch (command) {
        case 'N':
          robot.moveNorth();
          break;
        case 'W':
          robot.moveWest();
          break;
        case 'E':
          robot.moveEast();
          break;
        case 'S':
          robot.moveSouth();
          break;
      }
    }
}

function sendCommandsAndReportPosition(robot: Robot, commands: string) {
    parseCommands(robot, commands);
    console.log(`Robot position: (${robot.x}, ${robot.y})`);
}
  
const robot1 = new Robot(0, 0);
sendCommandsAndReportPosition(robot1, 'N E S W'); // Powinno zwrócić "Robot position: (0, 0)"

const robot2 = new Robot(0, 0);
sendCommandsAndReportPosition(robot2, 'N E N E N E N E'); // Powinno zwrócić "Robot position: (4, 4)"

const robot3 = new Robot(9, 9);
sendCommandsAndReportPosition(robot3, 'N N N E E E'); // Powinno zwrócić "Robot position: (9, 9)"
