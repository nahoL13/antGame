let playerAnt;
let soapBubbles = [];
let gameOver = false;
let restartButton;

let backgroundImage;
let antImage;

function preload() {
  backgroundImage = loadImage("assets/grass.jpeg");
  antImage = loadImage("assets/ant.png");
}

function setup() {
  createCanvas(600, 400);
  playerAnt = new AntPlayer();
  soapBubbles.push(new SoapBubble());
  restartButton = createButton("Reiniciar");
  restartButton.position(width / 2 - 40, height / 2 + 40);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background(backgroundImage);

  if (!gameOver) {
    playerAnt.display();
    playerAnt.move();

    for (let bubble of soapBubbles) {
      bubble.move();
      bubble.display();

      if (bubble.hit(playerAnt)) {
        gameOver = true;
      }
    }

    fill(255);
    textSize(16);
    text("Use W A S D ou setas para mover", 10, 20);
    text(`Bolhas na tela: ${soapBubbles.length}`, 10, 40);

    if (frameCount % 300 === 0) {
      soapBubbles.push(new SoapBubble());
    }
  } else {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 0, 0);
    text("Você perdeu!", width / 2, height / 2);
    restartButton.show();
    noLoop();
  }
}

function keyPressed() {
  let dir = createVector(0, 0);

  if (key === "w" || keyCode === UP_ARROW) dir.y = -1;
  if (key === "s" || keyCode === DOWN_ARROW) dir.y = 1;
  if (key === "a" || keyCode === LEFT_ARROW) dir.x = -1;
  if (key === "d" || keyCode === RIGHT_ARROW) dir.x = 1;

  playerAnt.setDirection(dir.x, dir.y);
}

function keyReleased() {
  let releasingY =
    ["w", "s"].includes(key) || [UP_ARROW, DOWN_ARROW].includes(keyCode);
  let releasingX =
    ["a", "d"].includes(key) || [LEFT_ARROW, RIGHT_ARROW].includes(keyCode);

  if (releasingY) playerAnt.velocity.y = 0;
  if (releasingX) playerAnt.velocity.x = 0;
}

function restartGame() {
  gameOver = false;
  playerAnt = new AntPlayer();
  soapBubbles = [new SoapBubble()];
  loop();
  restartButton.hide();
}

class AntPlayer {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.speed = 3;
    this.size = 30;
  }

  display() {
    fill(0);
    image(antImage, this.position.x, this.position.y, this.size, this.size);
  }

  move() {
    this.position.add(this.velocity);
    this.position.x = constrain(this.position.x, 0, width - this.size);
    this.position.y = constrain(this.position.y, 0, height - this.size);
  }

  setDirection(x, y) {
    this.velocity.set(x, y).mult(this.speed);
  }
}

class SoapBubble {
  constructor() {
    this.x = random(100, width - 100);
    this.y = random(100, height - 100);
    this.radius = 20;
    this.velocityX = random([-1, 10]);
    this.velocityY = random([-1, 10]);
  }

  display() {
    fill(100, 200, 255, 150);
    ellipse(this.x, this.y, this.radius * 2);
  }

  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x - this.radius < 0 || this.x + this.radius > width)
      this.velocityX *= -1;
    if (this.y - this.radius < 0 || this.y + this.radius > height)
      this.velocityY *= -1;
  }

  hit(ant) {
    let distance = dist(
      this.x,
      this.y,
      ant.position.x + ant.size / 2,
      ant.position.y + ant.size / 2
    );
    return distance < this.radius + ant.size / 2;
  }
}
