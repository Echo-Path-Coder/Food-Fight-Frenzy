function spawnBoxes() {
  // --- Spawn random yellow boxes ---
  boxTimer++;
  if (boxTimer % spawnInterval === 0) {
    boxes.push({
      x: random(width - boxSize),
      y: random(height - boxSize),
    });
  }
}

function drawBoxes() {
  // Draw and check for collection
  fill(255, 255, 0);
  for (let i = boxes.length - 1; i >= 0; i--) {
    let b = boxes[i];
    image(powerupImg, b.x - 10, b.y - 10, boxSize + 20, boxSize + 20);

    if (collides(playerX, playerY, playerSize, b.x, b.y, boxSize)) {
      boxes.splice(i, 1); // remove box when collected
      playerImmune = true;
      immuneTimer = immuneTime;
    }
  }
}

function immuneDuration() {
  if (playerImmune == true) {
    immuneTimer--;
    if (immuneTimer <= 0) {
      playerImmune = false;
    }
  }
}
