function timer() {
  textAlign(RIGHT, TOP);
  textSize(24);
  fill(0);

  // Calculate remaining time
  let elapsed = int((millis() - timeSurvived) / 1000);
  let timeLeft = totalTime - elapsed;
  score = abs(totalTime - timeLeft)

  // Keep time from going negative
  if (timeLeft < 0) timeLeft = 0;

  // Display timer in top-right
  text("Time: " + timeLeft, width - 10, 10);

  // When time hits zero
  if (timeLeft === 0 && gameStatus == "play") {
    gameStatus = "win";
    createPlayButton(2);
    createPlayButton(4);
  }
}

function displayCountdown() {
  textAlign(CENTER, CENTER);
  textSize(96);
  fill("red");

  // ---- INSTRUCTION PHASE ----
  if (instructionPhase) {
    if (instructionStartTime === 0) instructionStartTime = millis(); // start timer
    push();

  // Center and style setup
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textSize(26);
  textFont("Trebuchet MS");
  textStyle(BOLD);

  // Background box for readability
  const boxW = 620;
  const boxH = 230;
  fill(0, 0, 0, 160); // semi-transparent black
  noStroke();
  rect(width / 2, height / 2 - 60, boxW, boxH, 20);

  // Drop shadow for text
  const mainText =
    "The monster’s hungry and you’re dinner!\n" +
    "Hold down arrow keys or WASD to run!\n" +
    "Dodge a relentless, evil toilet that trips you,\n" +
    "and chomp yellow pellets for brief invincibility.\n" +
    "Stay alive for 90 seconds and\n" +
    "Escape the Hungry Gobbler!";

  // Shadow
  fill(0, 0, 0, 180);
  text(mainText, width / 2 + 2, height / 2 - 52);

  // Main text
  fill("#ffdc73"); // yellow-gold accent
  text(mainText, width / 2, height / 2 - 55);

  pop();

    // timer
    let timeLeft = int(10 - (millis() - instructionStartTime) / 1000);
    fill("yellow");
    textSize(36);
    text("Game starts in: " + max(timeLeft, 0), width / 2, height / 2 + 120);
    textSize(20);
    fill("blue");
    text("Press SPACE or ENTER to skip", width / 2, height - 60);

    // skip or auto-finish
    if (
      (keyIsPressed &&
      (keyCode === 32 || keyCode === ENTER)) || timeLeft <= 0
    ) {
      instructionPhase = false;
      countdownActive = true;
      startTime = millis();
    }
    return;
  }

  // ---- COUNTDOWN PHASE ----
  if (countdownActive) {
    let elapsed = int((millis() - startTime) / 1000);
    let countdown = 3;

    if (countdown - elapsed > 0) {
      text(countdown - elapsed, width / 2, height / 2);
    } else if (countdown - elapsed === 0) {
      text("GO!", width / 2, height / 2);
      showGo = true;
    } else if (showGo && elapsed > countdown + 0.1) {
      showGo = false;
      countdownActive = false;
      setupTrue = false;
      timeSurvived = millis();
    }
  }
}

//Restarts the game instructions
function resetCountdown() {
  instructionPhase = true;
  instructionStartTime = 0;
  countdownActive = false;
}
