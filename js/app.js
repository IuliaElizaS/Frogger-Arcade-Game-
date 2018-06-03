//selects the achorn class elements and adds them in an array
let achorns = document.querySelectorAll('.achorn');
let achornsList = Array.from(achorns);
let achornsCount = 0;

//selects the life class elements and adds them in an array
let lives = document.querySelectorAll('.life');
let livesList = Array.from(lives);
let life = 3;

//declares the audio variables
const step = new Audio('sounds/zapsplat_foley_feet_barefoot_scuff_single_carpet_on_wood_floor_004_20008.mp3');//sound source  https://www.zapsplat.com
const contact = new Audio('sounds/zapsplat_multimedia_click_002_19368.mp3');//sound source  https://www.zapsplat.com

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
      this.height = 101; // enemy's height
      this.width = 101; //enemy's width
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
      }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

// Now write your own player class
class Player {
    constructor(sprite, x, y) {
      this.sprite = sprite;
      this.x = x;
      this.y = y;
      this.height = 101;
      this.width = 101;
    }

    // This class requires an update(), render() and
    // a handleInput() method.
    update(dt) {
      // checks if player enters in collision with the collectible item
      // updated alghoritm from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
      if (this.x < collectible.x + collectible.width &&
          this.x + this.width > collectible.x &&
          this.y < collectible.y + collectible.height &&
          this.height + this.y > collectible.y) {
              contact.play();//plays a sound on collision
              this.sprite = 'images/char-with-achorn.png'; // changes the player image
              //moves the collectible item outside of the canvas
              collectible.x = -101;
              collectible.y = -101;
        }
        //checks if player reaches the earth
        if (this.y <= 0){
              //checks if player has the collectible item
              if (this.sprite === 'images/char-with-achorn.png'){
                achornCount(); // calls the collectible counter
                this.sprite = 'images/char.png';//changes the player's image
              }
              this.y = 505; // moves the player on the last row (on the grass)
              //moves the collectible item back on the canvas
              collectible.update();
          }
      }

      //draws the player on the screen
      render() {
          ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      }

      handleInput(key) {
      // checks which key was pressed and moves the player
        switch (key) {
            case 'left' : if (this.x > 0) {
                          this.x = this.x - 101; // moves the player to left if it doesn't cross the canvas' margin
                          step.play();//plays a sound for each step
                        }
            break;
            case 'up' : if (this.y > 0) {
                        this.y = this.y - 101;// moves the player up if it doesn't cross the canvas' margin
                        step.play();//plays a sound for each step
                      }
            break;
            case 'right' : if (this.x < 404) {
                          this.x = this.x + 101;// moves the player right if it doesn't cross the canvas' margin
                          step.play();//plays a sound for each step
                      }
            break;
            case 'down' : if (this.y < 505) {
                          this.y = this.y + 101;// moves the player down if it doesn't cross the canvas' margin
                          step.play();//plays a sound for each step
                      }
            }
      }
  }

//colectable item class
class Collectible {
    constructor  (x,y){
        this.sprite = 'images/achornSmall.png';
        this.x = x;
        this.y = y;
        this.height = 60; // collectibble item's height
        this.width = 60; //collectibble item's width
    }

    //sets a random position for the collectible
    update() {
        // sets a random x position
        const minX = 0;
        const maxX = 404;
        this.x= Math.floor(Math.random() * (maxX - minX + 1)) + minX; //radom method from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // sets a random y position
        const minY = 101;
        const maxY = 505;
        this.y= Math.floor(Math.random() * (maxY - minY + 1)) + minY; //radom method from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    }

    //draws the collectible on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy1 = new Enemy('images/enemy1.png', 50,101, 75);
let enemy2 = new Enemy('images/enemy2.png', 252, 202, 40);
let enemy3 = new Enemy('images/enemy3.png', 330, 303, 55);
let allEnemies = [enemy1, enemy2, enemy3];

// Place the player object in a variable called player
let player = new Player('images/char.png', 202,505);

// Place the collectible object in a variable called collectible
let collectible = new Collectible(101,303);

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

// checks if player enters in collision with the enemies
function checkCollisions(){
    allEnemies.forEach(function (enemy){
      // adapted alghoritm from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
      if (enemy.x < player.x + player.width &&
          enemy.x + enemy.width > player.x &&
          enemy.y < player.y + player.height &&
          enemy.height + enemy.y > player.y) {
          //plays a sound on collision
          contact.play();
          //moves the player back to it's start position
          player.x = 202;
          player.y = 505;
          //changes the player image
          player.sprite = 'images/char.png';
          //deletes one life
          life --;
          livesCount();
        }
    });
}

//runs the timer
let counter;
function timeCount(){
    let timer = document.querySelector('.time');
    let sec = 0;
    let min = 3;

    counter = setInterval(function(){
        //if the 3 minutes expired, stops the timer and calls stopModal()
        if (min === 0 && sec === 0){
            console.log('end of time');//just for debug purpose
            clearInterval(counter, 1000);
            stopModal();
        } else { //else continues counting down
        sec--;
        };
        if (sec < 0){
            min--;
            sec = 59;
        };
        timer.innerText = min +'m '+ sec + 's';
    }, 1000);
}

//counts the achorns if the player reaches the earth after collecting the achorn
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
        clearInterval(counter, 1000);
        stopModal();
    }
}

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
    };
  }
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
    };
}

//adds EventListener to the restart arrow
const restart = document.querySelector('.restart');
restart.addEventListener('click', reset);
