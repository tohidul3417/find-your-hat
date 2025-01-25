const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor() {
    this.field = Field.generateField(10, 12, 0.2);
    this.playerPosition = [0, 0];
    this.gameOver = false;
  }
  print() {
    this.field.forEach((row) => console.log(row.join('')));
  }

  movePlayer(direction) {
    const [x, y] = this.playerPosition;
    let newX = x;
    let newY = y;

    switch(direction) {
      case 'u':
        newX -= 1;
        break;
      case 'd':
        newX += 1;
        break;
      case 'r':
        newY += 1;
        break;
      case 'l':
        newY -= 1;
        break;
      default:
        console.log(`Invalid direction! Please, enter "u", "d", "r", or "l."`);
    }

    if (newX < 0 || newY < 0 || newX >= this.field.length || newY >= this.field[0].length) {
      console.log('You moved outside the field! Game over');
      this.gameOver = true;
      return;
    }

    // Check what is at the new position
    const newTile = this.field[newX][newY];
    if (newTile === hole) {
      console.log('You fell into a hole! Gave over.');
      this.gameOver = true;
    } else if (newTile ===hat) {
      console.log('You found the hat! You win!');
      this.gameOver = true;
      return;
    } else {
      this.field[newX][newY] = pathCharacter;
      this.playerPosition = [newX, newY];
    }
    this.field[newX][newY] = pathCharacter;
  }

  play() {
    while(!this.gameOver) {
      this.print();
      const direction = prompt('Which way? (u(up), d(down), l(left), r(right)): ').toLowerCase();
      this.movePlayer(direction);
    }
  }

  static generateField(width, height, holePercentage=0.2) {
    const field = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(fieldCharacter);
      }
      field.push(row);
    }
    
    // Add holes based on the hole percentage
    const totalTiles = height * width;
    const totalHoles = Math.floor(totalTiles * holePercentage);
    let holesPlaced = 0;

    while(holesPlaced < totalHoles) {
      const randomX = Math.floor(Math.random() * height);
      const randomY = Math.floor(Math.random() * width);

      if (field[randomX][randomY] === fieldCharacter && !(randomX === 0 && randomY === 0)) {
        field[randomX][randomY] = hole;
        holesPlaced++;
      }
    }

    // Add the hat at a random position that is not the starting point
    let hatPlaced = false;
    while (!hatPlaced) {
      const hatX = Math.floor(Math.random() * height);
      const hatY = Math.floor(Math.random() * width);

      if (field[hatX][hatY] === fieldCharacter && !(hatX === 0 && hatY === 0)) {
        field[hatX][hatY] = hat;
        hatPlaced = true;
      }
    }

    // Set the starting point
    field[0][0] = pathCharacter;

    return field;
  }
    
  
}


Field.generateField(15, 10, 0.2);
const myField = new Field();
myField.play()