let angle = 0;          // Current angle of the radar beam
let speed = 0.03;       // Speed of rotation
let isPaused = false;   // Pause state

// Arrays for 4 target dots (one in each quadrant) and their fade transparency
let targetOffsetX = [95, 65, -50, -115];
let targetOffsetY = [-85, 100, 125, -55];
let targetAlpha = [0, 0, 0, 0];

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(15, 24, 18); // Dark radar background
  
  // Center coordinates of the radar
  let cx = width / 2;
  let cy = height / 2 - 25;
  let radius = 180;
  
  // 1. Draw 3 concentric circles and crosshairs (all lines use the exact same style)
  noFill();
  stroke(35, 110, 65);
  strokeWeight(1);
  ellipse(cx, cy, 360, 360); // Outer circle
  ellipse(cx, cy, 240, 240); // Middle circle
  ellipse(cx, cy, 120, 120); // Inner circle
  line(cx - radius, cy, cx + radius, cy); // Horizontal line
  line(cx, cy - radius, cx, cy + radius); // Vertical line
  
  // 2. Update angle over time if not paused
  if (!isPaused) {
    angle += speed;
    if (angle >= TWO_PI) {
      angle -= TWO_PI;
    }
  }
  
  // 3. MATHEMATICS: Polar to Cartesian coordinate conversion for radar tip
  let tipX = cx + radius * cos(angle);
  let tipY = cy + radius * sin(angle);
  
  // Draw the moving radar sweep line
  stroke(60, 255, 130);
  strokeWeight(2.5);
  line(cx, cy, tipX, tipY);
  
  // 4. Stationary target dots: Only visible when swept by the radar tip, then fade out
  noStroke();
  for (let i = 0; i < 4; i++) {
    let tx = cx + targetOffsetX[i];
    let ty = cy + targetOffsetY[i];
    
    // Calculate target angle relative to center (0 to TWO_PI)
    let targetAngle = atan2(targetOffsetY[i], targetOffsetX[i]);
    if (targetAngle < 0) {
      targetAngle += TWO_PI;
    }
    
    // Light up dot when the sweep line reaches its angle
    if (abs(angle - targetAngle) < 0.08) {
      targetAlpha[i] = 255;
    }
    
    // Draw dot only if visible, then fade it out gradually
    if (targetAlpha[i] > 0) {
      fill(80, 255, 150, targetAlpha[i]);
      ellipse(tx, ty, 12, 12);
      
      if (!isPaused) {
        targetAlpha[i] -= 2.2;
      }
    }
  }
  
  // 5. Display plain, static control instructions on the canvas
  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  text("CONTROLS: [UP / DOWN] Change Speed  |  [SPACE] Pause", width / 2, height - 25);
}

// Keyboard controls
function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused; // Toggle pause
  } else if (keyCode === UP_ARROW) {
    speed += 0.005; // Increase speed
  } else if (keyCode === DOWN_ARROW) {
    speed = max(0.005, speed - 0.005); // Decrease speed
  }
}
