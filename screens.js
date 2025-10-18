//Create the leaderboard
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [
  { initials: "Ronald", location: "California", score: 80 },
  { initials: "Jeff", location: "New York", score: 60 },
  { initials: "Sarah", location: "Oceania", score: 30 },
];
localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

//Update leaderboard if higher score
function updateLeaderboard(initials, location, score) {
  // Check if player already exists in leaderboard
  let player = leaderboard.find((entry) => entry.initials === initials);

  if (player) {
    // Update score if it's higher
    if (score > player.score) {
      player.score = score;
      player.location = location; // update location too
    }
  } else {
    // Add new entry
    leaderboard.push({ initials, location, score });
  }

  // Sort leaderboard from highest to lowest score
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep top 5 entries (you can change the number)
  leaderboard = leaderboard.slice(0, 5);

  if (leaderboard.length > 3) {
    leaderboard.splice(3 - leaderboard.length, 3);
  }

  // Save updated leaderboard to localStorage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

//Create function to make buttons
function createPlayButton(button) {
  if (button == 0) {
    // create a "Play" button
    playButton = createButton("Play", width / 2 - 50, height / 2 - 25, 150, 75);
    playButton.setStyle({
      textSize: 30,
      fillBg: color("orange"),
      fillBgHover: color("yellow"),
      fillLabel: color(0),
      rounding: 12,
      strokeBg: color(0),
    });
  }

  if (button == 1) {
    playButton2 = createButton(
      "Play",
      width / 2 - 60,
      height / 2 + 60,
      150,
      75
    );
    playButton2.setStyle({
      textSize: 30,
      fillBg: color("orange"),
      fillBgHover: color("yellow"),
      fillLabel: color(0),
      rounding: 12,
      strokeBg: color(0),
    });
  }
  if (button == 2) {
    backButton.visible = true;
    backButton.enabled = true;
    if (!backButton) {
      // create a "Play" button
      backButton = createButton(
        "Back To Menu",
        width / 2 - 75,
        height / 2 + 40,
        150,
        50
      );
      backButton.setStyle({
        textSize: 30,
        fillBg: color("orange"),
        fillBgHover: color("yellow"),
        fillLabel: color(0),
        rounding: 12,
        strokeBg: color(0),
      });
    }
  }
  if (button == 3) {
    // create a "Play" button
    leaderboardButton = createButton(
      "Leaderboard",
      width / 2 - 50,
      height / 2 - 25,
      100,
      50
    );
    leaderboardButton.setStyle({
      fillBg: color("orange"),
      fillBgHover: color("yellow"),
      fillLabel: color(0),
      rounding: 12,
      strokeBg: color(0),
    });
  }
  try {
    if (button == 4) {
      saveButton.visible = true;
      saveButton.enabled = true;
      if (!saveButton) {
        // create a "Play" button
        saveButton = createButton(
          "Save Score",
          width / 2 - 75,
          height / 2 + 100,
          150,
          50
        );
         saveButton.setStyle({
          textSize: 30,
          fillBg: color("orange"),
          fillBgHover: color("yellow"),
          fillLabel: color(0),
          rounding: 12,
          strokeBg: color(0),
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

//Winner screen
function winnerScreen() {
  textAlign(CENTER, CENTER);
  textSize(72);
  fill("limegreen");
  text("YOU WIN", width / 2, height / 4);
  
  gameOver = true;
  drawGui();
  
  //Check if buttons are pressed
  if (currentScreen == "play" && backButton.isPressed) {
    backButton.visible = false;
    saveButton.visible = false;
    currentScreen = "menu";
    createPlayButton(0);
  }
  if (currentScreen == "play" && saveButton.isPressed) {
    currentScreen = "leaderboard";
  }
}

//Loser screen
function loserScreen() {
  fill("red");
  textSize(96);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 4);
  
  gameOver = true;
  enemySpeed = 0;
  playerSpeed = 0;
  
  //Check if buttons are pressed
  if (currentScreen == "play" && backButton.isPressed) {
    backButton.visible = false;
    backButton.enabled = false;
    saveButton.visible = false;
    saveButton.enabled = false;
    currentScreen = "menu";
    createPlayButton(0);
  }
  drawGui();
  if (currentScreen == "play" && saveButton.isPressed) {
    updateLeaderboard(
      localStorage.getItem("playerInitials"),
      localStorage.getItem("playerLocation"),
      score
    );
    currentScreen = "leaderboard";
  }
}

function playScreen() {
  if (currentScreen == "play") {
    image(gameBackground, 0, 0, width, height);
    
    //Setup game
    if (setupTrue == true) {
      selectEnemyPos();
      spawnTripTile();
      displayCountdown();

      //Count down
      if (start == true) {
        startTime = millis();
        start = false;
      }

      enemySpeed = 2;
      playerSpeed = 5;

      gameStatus = "play";

      loop();
    } else {
      collideTile();
      tripPlayer();

      // Draw player
      fill(0, 150, 255);
      image(playerFrame, playerX, playerY, 50, 50);

      // Draw enemy
      fill(255, 50, 50);
      image(
        foodMonsterImg,
        enemyX - 30,
        enemyY - 30,
        enemySize + 60,
        enemySize + 60
      );

      //Give immune shield
      if (playerImmune == true) {
        //Write immune text
        text((immuneTimer - immuneTime / 100) / 100, playerX + 40, playerY - 30);
        image(immuneShield, playerX - 5, playerY - 5, 60, 60);
      }

      // Move the tile
      tripTile.x += tripTile.speedX;
      tripTile.y += tripTile.speedY;

      // Bounce off edges
      if (tripTile.x <= 0 || tripTile.x + tripTile.size >= width) {
        tripTile.speedX *= -1;
      }
      if (tripTile.y <= 0 || tripTile.y + tripTile.size >= height) {
        tripTile.speedY *= -1;
      }
      //Draw obstacles
      fill("yellow");
      image(
        toiletImg,
        tripTile.x - 10,
        tripTile.y - 10,
        tripTile.size + 20,
        tripTile.size + 20
      );

      //Playing the game
      if (gameStatus == "play") {
        timer();

        movePlayer();

        spawnBoxes();
        drawBoxes();

        // --- Enemy movement (chase player) ---
        let dx = playerX - enemyX;
        let dy = playerY - enemyY;
        let distance = dist(enemyX, enemyY, playerX, playerY);

        if (distance > 0) {
          enemyX += (dx / distance) * enemySpeed;
          enemyY += (dy / distance) * enemySpeed;
        }

        // --- Detect collision ---
        if (
          collides(playerX, playerY, playerSize, enemyX, enemyY, enemySize) &&
          playerImmune != true
        ) {
          gameStatus = "lose";
          createPlayButton(2);
          createPlayButton(4);
        }
      }
    }

    //Check screens
    if (gameStatus == "win") {
      winnerScreen();
    }
    if (gameStatus == "lose") {
      loserScreen();
    }
    if (playerImmune == true) {
      immuneDuration();
    }
  }
}

//Create menus with buttons
function drawMenu() {
  if (currentScreen == "menu") {
    initialsInput.hide();
    locationSelect.hide();
    
    //In case any errors happen
    try {
      backButton.visible = false;
      saveButton.visible = false;
    } catch (err) {}
    try {
      playButton2.visible = false;
    } catch {}
    
    //Style the menu
    image(menuBackground, 0, 0, width, height);
    stroke("black");
    strokeWeight(3);
    fill("yellow");
    textAlign(CENTER, CENTER);
    textSize(60);
    text("Food Fight Frenzy", width / 2, 120);
    drawGui();
    leaderboardButton.draw();
  }
  
  //Check if buttons are pressed
  if (currentScreen === "menu" && playButton.isPressed) {
    currentScreen = "select";
    strokeWeight(1);
    playButton.visible = false;
    createPlayButton(1);
  }
  leaderboardButton.onPress = function () {
    currentScreen = "leaderboard";
    createPlayButton(2);
  };
}

//Create a screen where the player can enter data
function selectScreen() {
  if (currentScreen == "select") {
    if (dataLoaded == false) {
      positionInputs()
      
      // load only once
      const savedInitials = localStorage.getItem("playerInitials");
      const savedLocation = localStorage.getItem("playerLocation");

      if (savedInitials) initialsInput.value(savedInitials);
      if (savedLocation) locationSelect.value(savedLocation);

      dataLoaded = true; // mark as loaded
    }

    //Declare input values
    var initials = initialsInput.value().trim();
    var location = locationSelect.value();

    //Style page
    image(gameBackground, 0, 0, width, height);

    stroke("black");
    strokeWeight(3);
    fill("yellow");
    text(" Enter your initials \n and location", width / 2, height / 2 - 100);

    //Show the input boxes
    initialsInput.show();
    locationSelect.show();
    drawGui();

    //Play game when pressed
    if (playButton2.isPressed) {
      if (initials.length >= 3 && location != "") {
        localStorage.setItem("playerInitials", initials);
        localStorage.setItem("playerLocation", location);

        currentScreen = "play";
        strokeWeight(1);
        initialsInput.hide();
        locationSelect.hide();
        playButton2.visible = false;

        dataLoaded = false; // reset for next time
      } else {
        alert("Please enter 3 initials and select a location!");
      }
    }
  }
}

//Create leaderboard screen
function leaderboardScreen() {
  if (currentScreen == "leaderboard") {
    fill('yellow')
    image(trophyRoom, 0, 0, width, height);
    initialsInput.hide();
    locationSelect.hide();
    
    //Disable buttons
    saveButton.visible = false;
    saveButton.enabled = false;

    playButton.visible = false;
    playButton2.visible = false;

    drawGui();

    text("🏆 Dummy Leaderboard 🏆", width / 2, 40);
    textSize(24);

    // Draw leaderboard
    for (let i = 0; i < leaderboard.length; i++) {
      let entry = leaderboard[i];
      text(
        `${i + 1}. ${entry.initials} \n ${entry.location}, Score: ${
          entry.score
        }`,
        width / 2,
        100 + i * 75
      );
    }
    if (currentScreen == "leaderboard" && backButton.isPressed) {
      currentScreen = "menu";
      createPlayButton(0);
    }
  }
}
