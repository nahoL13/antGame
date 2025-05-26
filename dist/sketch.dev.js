"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var playerAnt;
var soapBubbles = [];
var gameOver = false;
var restartButton;
var backgroundImage;
var antImage;

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

    for (var _i = 0, _soapBubbles = soapBubbles; _i < _soapBubbles.length; _i++) {
      var bubble = _soapBubbles[_i];
      bubble.move();
      bubble.display();

      if (bubble.hit(playerAnt)) {
        gameOver = true;
      }
    }

    fill(255);
    textSize(16);
    text("Use W A S D ou setas para mover", 10, 20);
    text("Bolhas na tela: ".concat(soapBubbles.length), 10, 40);

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
  var dir = createVector(0, 0);
  if (key === "w" || keyCode === UP_ARROW) dir.y = -1;
  if (key === "s" || keyCode === DOWN_ARROW) dir.y = 1;
  if (key === "a" || keyCode === LEFT_ARROW) dir.x = -1;
  if (key === "d" || keyCode === RIGHT_ARROW) dir.x = 1;
  playerAnt.setDirection(dir.x, dir.y);
}

function keyReleased() {
  var releasingY = ["w", "s"].includes(key) || [UP_ARROW, DOWN_ARROW].includes(keyCode);
  var releasingX = ["a", "d"].includes(key) || [LEFT_ARROW, RIGHT_ARROW].includes(keyCode);
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

var AntPlayer =
/*#__PURE__*/
function () {
  function AntPlayer() {
    _classCallCheck(this, AntPlayer);

    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.speed = 3;
    this.size = 30;
  }

  _createClass(AntPlayer, [{
    key: "display",
    value: function display() {
      fill(0);
      image(antImage, this.position.x, this.position.y, this.size, this.size);
    }
  }, {
    key: "move",
    value: function move() {
      this.position.add(this.velocity);
      this.position.x = constrain(this.position.x, 0, width - this.size);
      this.position.y = constrain(this.position.y, 0, height - this.size);
    }
  }, {
    key: "setDirection",
    value: function setDirection(x, y) {
      this.velocity.set(x, y).mult(this.speed);
    }
  }]);

  return AntPlayer;
}();

var SoapBubble =
/*#__PURE__*/
function () {
  function SoapBubble() {
    _classCallCheck(this, SoapBubble);

    this.x = random(100, width - 100);
    this.y = random(100, height - 100);
    this.radius = 20;
    this.velocityX = random([-1, 10]);
    this.velocityY = random([-1, 10]);
  }

  _createClass(SoapBubble, [{
    key: "display",
    value: function display() {
      fill(100, 200, 255, 150);
      ellipse(this.x, this.y, this.radius * 2);
    }
  }, {
    key: "move",
    value: function move() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      if (this.x - this.radius < 0 || this.x + this.radius > width) this.velocityX *= -1;
      if (this.y - this.radius < 0 || this.y + this.radius > height) this.velocityY *= -1;
    }
  }, {
    key: "hit",
    value: function hit(ant) {
      var distance = dist(this.x, this.y, ant.position.x + ant.size / 2, ant.position.y + ant.size / 2);
      return distance < this.radius + ant.size / 2;
    }
  }]);

  return SoapBubble;
}();