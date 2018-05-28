let achorns = document.querySelectorAll('.achorn');
let achornsList = Array.from(achorns);
let achornsCount = 0;

let lives = document.querySelectorAll('.life');
let livesList = Array.from(lives);
let life = 3;

// Enemies our player must avoid
class Enemy {
  constructor(sprite, x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

      this.sprite = sprite; // enemy image
      this.x = x; // x coordinate
      this.y = y; // y coordinate
      this.speed = speed; // moving speed
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x = this.x + (this.speed * dt);
      if (this.x > 505) {
          this.x = -100;
      };
    }

    checkCollisions(){
      // checks if player enters in collision with enemy
      if (this.x === player.x & this.y === player.y) {
          //moves the player back to it's start position
          player.x = 250;
          player.y = 498;
          //changes the player image
          player.sprite = 'char.png';
          //deletes one life
          life --;
          livesCount();
        };
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  };

// Now write your own player class
class Player {
    constructor(sprite, x, y) {
      this.sprite = sprite;
      this.x = x;
      this.y = y;
    }

    // This class requires an update(), render() and
    // a handleInput() method.
    update(dt) {
        //if player enters in collision with the colectable item
        if (this.x === colectable.x & this.y === colectable.y) {
              this.sprite = 'char-with-achorn.png'; // changes the player image
              //moves the collectable item outside of the canvas
              colectable.x = -101;
              colectable.y = -83;
        };
        //checks if player reaches the mountain
        if (this.y <= 83){
              //checks if player has the colectable item
              if (this.sprite === 'char-with-achorn.png'){
                achornCount(); // calls the colectable counter
                this.sprite = 'char.png'//changes the player's image
              };
              this.y = 498; // moves the player on the last row (on the grass)
              //moves the collectable item back on the canvas
              colectable.randomPosition();
          };
      }

      //draws the player on the screen
      render() {
          ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      }

      handleInput() {
      // checks which key was pressed moves the player
        switch (allowedKeys[e.keyCode]) {
            case 37 : if (this.x >= 101) {
                          this.x = this.x - 101;
                        };  // moves the player to left if it doesn't cross the canvas' margin
            break;
            case 38 : if (this.y >= 83) {
                        this.y = this.y - 83;
                      }; // moves the player up if it doesn't cross the canvas' margin
            break;
            case 39 : if (this.x <= 404) {
                          this.x = this.x + 101;
                      }; // moves the player right if it doesn't cross the canvas' margin
            break;
            case 40 : if (this.y <= 415) {
                          this.y = this.y - 83;
                      }; // moves the player down if it doesn't cross the canvas' margin
            };
      }
  };

//colectable item class
class Colectable {
    constructor  (x,y){
        this.sprite = 'images/achornSmall.png';
        this.x = x;
        this.y = y;
    }

    //sets a random position for the colectable
    randomPosition() {
        // sets a random x position
        const minX = 0;
        const maxX = 404;
        this.x= Math.floor(Math.random() * (maxX - minX + 1)) + minX; //radom method from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // sets a random y position
        const minY = 83;
        const maxY = 415;
        this.y= Math.floor(Math.random() * (maxY - minY + 1)) + minY; //radom method from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    }

    //draws the colectable on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy1 = new Enemy('images/enemy1.png', 120, 84, 3);
let enemy2 = new Enemy('images/enemy2.png', 280, 167, 2);
let enemy3 = new Enemy('images/enemy3.png', 0, 250, 5);
let allEnemies = ['enemy1', 'enemy2', 'enemy3'];

// Place the player object in a variable called player
let player = new Player('char.png', 250, 498);

// Place the colectable object in a variable called colectable
let colectable = new Colectable();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//runs the timer
function timeCount(){
    let timer = document.querySelector('.time');
    let counter;
    let sec = 59;
    let min = 2;

    counter = setInterval(function(){
        sec--;
        if (sec === 0){
            min--;
            sec = 59;
        };
        timer.innerText = min +'m '+ sec + 's';
    }, 1000);
    //if the 3 minutes expired, stops the timer and calls stopModal()
    if (min === 0 & sec === 0) {
        clearInterval(counter,1000);
        stopModal();
    };
  };

//counts the achorns if the player reaches the mountain after collecting the achorn
function achornCount(){
   achornsCount ++;
   achornsList[0].innerText = achornsCount;
   achornsList[1].innerText = achornsCount;
 }

//checks the number of lives, controls the lives score and ends the game if requiered
function livesCount() {
    if (life === 2) {
        livesList[2].classList.add('hide');
    } else if (life === 1) {
        livesList[1].classList.add('hide');
    } else if (life === 0) {
        livesList[0].classList.add('hide');
    } else if (life === -1) {
        stopModal();
    }
};

//resets the game
function reset() {
    location.reload(true);
}

//implements the start modal - adapted source:https://www.w3schools.com/howto/howto_css_modals.asp
function startModal() {
    const startModal = document.querySelector('.startModal');
    const playButton = document.querySelector('.play');
    //when the user clicks on the Play button, closes the modal and starts the game
    playButton.onclick = function() {
        startModal.style.display = "none";
        //starts the timer
        timeCount();
    }
  };
startModal();

//implements the stop modal
function stopModal() {
    const stopModal = document.querySelector('.stopModal');
    const restartButton = document.querySelector('.close');
    stopModal.style.display = "block";
    //when the user clicks on the Restart button, closes the modal and restarts the game
    restartButton.onclick = function() {
        stopModal.style.display = "none";
        reset();
    }
};

//adds EventListener to the restart arrow
const restart = document.querySelector('.restart');
restart.addEventListener('click', reset);
