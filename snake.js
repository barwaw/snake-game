const backgroundColor = "#393939";
const displayColor = "#41FF00";
const tileSize = 20;
const tileCount = 20;

const gameOverEvent = new CustomEvent("gameover");

const c = document.querySelector("canvas");
c.setAttribute("width", `${tileCount * tileSize}px`);
c.setAttribute("height", `${tileCount * tileSize}px`);
const ctx = c.getContext("2d");

const scoreDisplay = document.querySelector(".score");
const highScoreDisplay = document.querySelector(".high-score");

function draw() {
  clearScreen();
  drawSnake();
  checkAppleCollision();
  drawApple();
  updateSnake();
  checkForGameOver();
}

function checkCollision(a, b) {
  if (a.x === b.x && a.y === b.y) return true;
  else return false;
}

function checkForGameOver() {
  //snake hits itself
  for (let i = 2; i < snake.length; i++) {
    if (checkCollision(snake[0], snake[i])) {
      clearInterval(intervalId);
      document.dispatchEvent(gameOverEvent);
    }
  }

  //snake hits wall
  if (
    snake[0].x < 0 ||
    snake[0].x >= tileCount * tileSize ||
    snake[0].y < 0 ||
    snake[0].y >= tileCount * tileSize
  ) {
    clearInterval(intervalId);
    document.dispatchEvent(gameOverEvent);
  }
}

function drawApple() {
  ctx.strokeStyle = displayColor;
  ctx.lineWidth = 4;
  findSpotForApple();
  ctx.strokeRect(apple.x + 2, apple.y + 2, tileSize - 4, tileSize - 4);
}

function findSpotForApple() {
  let applePlacedOnSnake = false;
  do {
    for (const part of snake) {
      if (checkCollision(part, apple)) {
        applePlacedOnSnake = true;
        break;
      } else applePlacedOnSnake = false;
    }
    if (applePlacedOnSnake) changeApplePosition();
  } while (applePlacedOnSnake);
}

function changeApplePosition() {
  apple.x = Math.floor(Math.random() * tileCount) * tileSize;
  apple.y = Math.floor(Math.random() * tileCount) * tileSize;
}

function checkAppleCollision() {
  if (checkCollision(snake[0], apple)) {
    changeApplePosition();
    drawApple();
    snake.push({});
    addPoint();
    increaseSpeed();
  }
}

function addPoint() {
  points++;
  scoreDisplay.textContent = points;
}

function increaseSpeed() {
  if (points % 5 == 0) {
    speed += 1;
    clearInterval(intervalId);
    intervalId = setInterval(draw, 1000 / speed);
  }
}

function clearScreen() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, c.width, c.height);
}

function drawSnake() {
  ctx.fillStyle = displayColor;
  if (xSpeed === 0 && ySpeed === 0) {
    ctx.fillRect(snake[0].x, snake[0].y, tileSize, tileSize);
    return;
  }
  snake.forEach((part) => ctx.fillRect(part.x, part.y, tileSize, tileSize));
}

function updateSnake() {
  if (xSpeed !== 0 || ySpeed !== 0) {
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
  }
  snake[0].x += tileSize * xSpeed;
  snake[0].y += tileSize * ySpeed;
}

//controller
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && ySpeed !== 1) {
    ySpeed = -1;
    xSpeed = 0;
  } else if (e.key === "ArrowDown" && ySpeed !== -1) {
    ySpeed = 1;
    xSpeed = 0;
  } else if (e.key === "ArrowRight" && xSpeed !== -1) {
    xSpeed = 1;
    ySpeed = 0;
  } else if (e.key === "ArrowLeft" && xSpeed !== 1) {
    xSpeed = -1;
    ySpeed = 0;
  }
});

function updateHighScore() {
  if (highscore) {
    if (highscore < points) localStorage.setItem("highscore", points);
  } else localStorage.setItem("highscore", points);
  highScoreDisplay.textContent = localStorage.getItem("highscore");
}

function drawGameOverMessage() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(50, 150, c.width - 50 * 2, c.height - 150 * 2);

  ctx.fillStyle = displayColor;
  ctx.font = "bold 50px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", 200, 200);
}

document.addEventListener("gameover", () => {
  updateHighScore();
  drawGameOverMessage();
});

//initialization
let speed = 5;
let xSpeed = 0;
let ySpeed = 0;
let points = 0;

let snake = [{ x: 10 * tileSize, y: 10 * tileSize }, {}, {}];

let apple = {};
changeApplePosition();

let highscore = localStorage.getItem("highscore");
if (highscore) highScoreDisplay.textContent = highscore;
console.log(localStorage.getItem("highscore"));

let intervalId = setInterval(draw, 1000 / speed);
