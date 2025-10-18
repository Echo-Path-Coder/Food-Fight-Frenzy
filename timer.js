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
  }
}

function displayCountdown() {
  textAlign(CENTER, CENTER);
  textSize(96);
  fill("red");

  let elapsed = int((millis() - startTime) / 1000); // seconds passed

  if (countdown - elapsed > 0) {
    // Show countdown number
    text(countdown - elapsed, width / 2, height / 2);
  } else if (countdown - elapsed === 0) {
    // Show "GO!" for 1 second
    text("GO!", width / 2, height / 2);
    showGo = true;
  } else if (showGo && elapsed > countdown + 0.1) {
    // After GO disappears
    showGo = false;
    setupTrue = false;
    timeSurvived = millis();
  }
}
