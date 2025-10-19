//Declare all the variables
let playerX, playerY;
let playerSize = 50;
let playerSpeed = 5;
let playerImmune = false;
let playerFrozen = false;
let playerAnimation = 0;
let playerFrame;
let immuneTime = 300;
let immuneTimer = 0;

//Enemy Variables
let enemyX, enemyY;
let enemySize = 40;
let enemySpeed = 1;

//Game status variables
let setupTrue = true;
let gameOver = false;
let start = true;

let countdown = 3;
let startTime;
let showGo = false;

let timeSurvived;
let totalTime = 90;
let gameStatus;

//Boxes
let boxes = [];
let boxSize = 30;
let spawnInterval = 300;
let boxTimer = 0;

//Triptiles
let tripTile = {};
let lastMove = { x: 0, y: 0 };
let tripCount;
let tripCooldown = false;
let currentScreen = "menu";
let gui;

//Images
let menuBackground,
  gameBackground,
  playerStand,
  playerWalk1,
  playerWalk2,
  playerWalk3,
  trophyImg,
  trophyRoom,
  immuneShield,
  playerWalk4,
  playerWalk5,
  playerWalk6,
  playerDown,
  toiletImg,
  foodMonsterImg,
  powerupImg;

//Rest
let score = 0;

let initialsInput, locationSelect, playButton2;
let dataLoaded = false;
let savedInitials, savedLocation;

let backButton, leaderboardButton, savedBoard, saveButton;

let backgroundSong

let songStart = false

let gameCanvas;

let instructionPhase = true;
let instructionStartTime = 0;
let countdownActive = false;

function preload() {
  menuBackground = loadImage("Images/cafeteria.png");
  gameBackground = loadImage("Images/gameBackground.png");
  playerStand = loadImage("Images/playerStand.png");
  playerWalk1 = loadImage("Images/playerWalk1.png");
  playerWalk2 = loadImage("Images/playerWalk2.png");
  playerWalk3 = loadImage("Images/playerWalk3.png");
  playerWalk4 = loadImage("Images/playerWalk4.png");
  playerWalk5 = loadImage("Images/playerWalk5.png");
  playerWalk6 = loadImage("Images/playerWalk6.png");
  playerDown = loadImage('Images/playerDown.png')
  playerFrame = playerStand;

  foodMonsterImg = loadImage("Images/foodMonster.png");

  trophyImg = loadImage("Images/trophy.png");
  trophyRoom = loadImage("Images/trophyRoom.png");

  immuneShield = loadImage("Images/immuneShield.png");
  toiletImg = loadImage("Images/toilet.png");
  powerupImg = loadImage("Images/powerup.png");
  backgroundSong = loadSound("Images/backgroundSong.mp3");
}

function noScroll() {
  document.body.style.overflow = "hidden"; // disable scrollbars
  document.documentElement.style.overflow = "hidden";
}

function setup() {
  gameCanvas = createCanvas(600, 600);

  noScroll()
  
  gui = createGui();

  playButton = createButton("Play", width / 2 - 75, height / 2 - 60, 150, 75);
  playButton.setStyle({
    textSize: 30,
    fillBg: color("orange"),
    fillBgHover: color("yellow"),
    fillLabel: color(0),
    rounding: 12,
    strokeBg: color(0),
  });

playButton2 = createButton("Play", width / 2 - 50, height / 2 + 25, 150, 75);
  playButton2.setStyle({
    textSize: 30,
    fillBg: color("orange"),
    fillBgHover: color("yellow"),
    fillLabel: color(0),
    rounding: 12,
    strokeBg: color(0),
  });
  playButton2.visible = false
  playButton2.enabled = false
  
  backButton = createButton("Back To Menu", width / 2 - 100, height / 2, 225, 75);
  backButton.setStyle({
    textSize: 30,
    fillBg: color("orange"),
    fillBgHover: color("yellow"),
    fillLabel: color(0),
    rounding: 12,
    strokeBg: color(0),
  });

  saveButton = createButton("Save Score", width / 2 - 100, height / 2 + 100, 225, 75);
  saveButton.setStyle({
    textSize: 30,
    fillBg: color("orange"),
    fillBgHover: color("yellow"),
    fillLabel: color(0),
    rounding: 12,
    strokeBg: color(0),
  });

  leaderboardButton = new Clickable();
  leaderboardButton.resize(75, 75);
  leaderboardButton.image = trophyImg;
  leaderboardButton.text = "Leaderboard";
  leaderboardButton.textColor = "white";
  leaderboardButton.locate(0, 0);

  initialsInput = createInput();
  initialsInput.attribute("maxlength", 30);
  initialsInput.attribute("placeholder", "Enter Initials");
  initialsInput.size(100);
  initialsInput.input(saveInput);

  locationSelect = createInput();
  locationSelect.attribute("maxlength", 30);
  locationSelect.attribute("placeholder", "Enter Location");
  locationSelect.size(150);
  locationSelect.input(saveInput);

  positionInputs(); // fix input alignment
}

function positionInputs() {
  let rect = gameCanvas.elt.getBoundingClientRect(); // ✅ correct element reference

  initialsInput.position(rect.left + width / 2 - 50, rect.top + height / 2 - 20);
  locationSelect.position(rect.left + width / 2 - 50, rect.top + height / 2 + 20);
}

function windowResized() {
  positionInputs(); // ✅ realign on resize
}


//Select random enemy positions
function selectEnemyPos() {
  playerX = width / 2;
  playerY = height / 2;
  randX = random(1);
  randY = random(1);
  
  //Random X and Y
  if (randX < 0.5) {
    enemyX = random(0, playerX - 50);
  } else {
    enemyX = random(playerX + 50, width);
  }
  if (randY < 0.5) {
    enemyY = random(0, playerY - 50);
  } else {
    enemyY = random(playerY + 50, height);
  }
}

//Function to control player movement and animation
function movePlayer() {
  if (playerFrozen != true) {
    if (playerAnimation >= 15) {
      playerAnimation = 0;
    }

    let dx = playerX;
    let dy = playerY;
    // --- Player movement ---
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) playerX -= playerSpeed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) playerX += playerSpeed;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) playerY -= playerSpeed;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) playerY += playerSpeed;

    // Keep player inside screen
    playerX = constrain(playerX, 0, width - playerSize);
    playerY = constrain(playerY, 0, height - playerSize);
    dx = playerX - dx;
    dy = playerY - dy;
    
    // Record last move direction for dash
    if (dx !== 0 || dy !== 0) {
      lastMove = { x: dx, y: dy };
      playerAnimation += 1;
    }

    //Check for each animation
    if (dx == 0 && dy == 0) {
      playerFrame = playerStand;
    } else if (dx > 0) {
      if (playerAnimation < 5) {
        playerFrame = playerWalk1;
      } else if (playerAnimation < 10) {
        playerFrame = playerWalk2;
      } else if (playerAnimation < 15) {
        playerFrame = playerWalk3;
      }
    } else if (dx < 0) {
      if (playerAnimation < 5) {
        playerFrame = playerWalk4;
      } else if (playerAnimation < 10) {
        playerFrame = playerWalk5;
      } else if (playerAnimation < 15) {
        playerFrame = playerWalk6;
      }
    } else if (
      playerFrame == playerWalk1 ||
      playerFrame == playerWalk2 ||
      playerFrame == playerWalk3
    ) {
      if (playerAnimation < 5) {
        playerFrame = playerWalk1;
      } else if (playerAnimation < 10) {
        playerFrame = playerWalk2;
      } else if (playerAnimation < 15) {
        playerFrame = playerWalk3;
      }
    } else if (
      playerFrame == playerWalk4 ||
      playerFrame == playerWalk5 ||
      playerFrame == playerWalk6
    ) {
      if (playerAnimation < 5) {
        playerFrame = playerWalk4;
      } else if (playerAnimation < 10) {
        playerFrame = playerWalk5;
      } else if (playerAnimation < 15) {
        playerFrame = playerWalk6;
      }
    } else {
      if (playerAnimation < 5) {
        playerFrame = playerWalk1;
      } else if (playerAnimation < 10) {
        playerFrame = playerWalk2;
      } else if (playerAnimation < 15) {
        playerFrame = playerWalk3;
      }
    }
  }
  else{
    //Trip animation
    playerFrame = playerDown
  }
}

function selectPlayerAnimation() {}

function draw() {
  background(220);

  //Draw screens
  drawMenu();
  selectScreen();
  playScreen();
  leaderboardScreen();
}

// Simple square collision check
function collides(x1, y1, s1, x2, y2, s2) {
  return x1 < x2 + s2 && x1 + s1 > x2 && y1 < y2 + s2 && y1 + s1 > y2;
}

function mouseClicked() {
  if (gameOver == true) {
    //Play again when clicked
    resetCountdown()
    setupTrue = true;
    gameOver = false;
    start = true;
    score = 0
    gameStatus = "start";
    boxes.splice(0, boxes.length);
    playerFrozen = false;
  }
  //Loop the song
  if(songStart == false){
    songStart = true
    backgroundSong.loop()
  }
}

//Save initials and location
function saveInput(initials, location) {
  localStorage.setItem("playerInitials", initials);
  localStorage.setItem("playerLocation", location);
}
