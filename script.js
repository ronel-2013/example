// =========================================
// NOVAPLAY ARCADE - script.js
// =========================================

// =========================================
// USER LOGIN SYSTEM
// =========================================

let currentUser =
localStorage.getItem("novaplayUser") || "Guest";

document.getElementById("userDisplay")
.innerHTML = currentUser;

function openLogin(){

  document.getElementById("loginModal")
  .style.display = "flex";

}

function loginUser(){

  const username =
  document.getElementById("usernameInput")
  .value.trim();

  if(username === ""){

    alert("Please enter username");

    return;

  }

  currentUser = username;

  localStorage.setItem(
    "novaplayUser",
    username
  );

  document.getElementById("userDisplay")
  .innerHTML = username;

  document.getElementById("loginModal")
  .style.display = "none";

}

// =========================================
// LEADERBOARD
// =========================================

let leaderboard =
JSON.parse(
localStorage.getItem("novaplayLeaderboard")
) || [];

function updateLeaderboard(){

  leaderboard.sort((a,b) =>
  b.score - a.score);

  const body =
  document.getElementById("leaderboardBody");

  body.innerHTML = "";

  leaderboard.slice(0,10)
  .forEach((player,index) => {

    body.innerHTML += `

      <tr>

        <td>#${index + 1}</td>

        <td>${player.name}</td>

        <td>${player.score}</td>

      </tr>

    `;

  });

}

updateLeaderboard();

function saveScore(score){

  if(currentUser === "Guest") return;

  const existing =
  leaderboard.find(player =>
  player.name === currentUser
  );

  if(existing){

    if(score > existing.score){

      existing.score = score;

    }

  } else {

    leaderboard.push({

      name: currentUser,
      score: score

    });

  }

  localStorage.setItem(

    "novaplayLeaderboard",

    JSON.stringify(leaderboard)

  );

  updateLeaderboard();

}

// =========================================
// GAME SYSTEM
// =========================================

const gameModal =
document.getElementById("gameModal");

const gameArea =
document.getElementById("gameArea");

const scoreText =
document.getElementById("score");

const gameTitle =
document.getElementById("gameTitle");

let score = 0;

function closeGame(){

  gameModal.style.display = "none";

  gameArea.innerHTML = "";

  clearInterval(window.gameLoop);
  clearInterval(window.enemyLoop);
  clearInterval(window.timerLoop);

}

// =========================================
// TARGET HUNTER
// =========================================

function startTargetGame(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "🎯 Target Hunter";

  score = 0;

  scoreText.innerHTML =
  "Score: 0";

  gameArea.innerHTML = `

    <div
      id="target"
      style="
        width:70px;
        height:70px;
        border-radius:50%;
        background:#22c55e;
        position:absolute;
        cursor:pointer;
      "
    ></div>

  `;

  const target =
  document.getElementById("target");

  function moveTarget(){

    const x =
    Math.random() *
    (gameArea.clientWidth - 70);

    const y =
    Math.random() *
    (gameArea.clientHeight - 70);

    target.style.left = x + "px";
    target.style.top = y + "px";

  }

  moveTarget();

  target.onclick = () => {

    score++;

    scoreText.innerHTML =
    "Score: " + score;

    moveTarget();

  };

  window.gameLoop =
  setInterval(moveTarget,700);

  setTimeout(() => {

    clearInterval(window.gameLoop);

    alert(
      "🎯 Game Over!\nScore: "
      + score
    );

    saveScore(score);

  },30000);

}

// =========================================
// SPEED CLICKER
// =========================================

function startSpeedClicker(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "⚡ Speed Clicker";

  score = 0;

  let timeLeft = 10;

  scoreText.innerHTML =
  "Score: 0 | Time: 10";

  gameArea.innerHTML = `

    <div style="
      height:100%;
      display:flex;
      justify-content:center;
      align-items:center;
    ">

      <button id="clickBtn" style="
        width:220px;
        height:220px;
        border-radius:50%;
        border:none;
        background:#22c55e;
        color:white;
        font-size:32px;
        cursor:pointer;
      ">
        CLICK
      </button>

    </div>

  `;

  const btn =
  document.getElementById("clickBtn");

  btn.onclick = () => {

    score++;

    scoreText.innerHTML =
    "Score: " + score +
    " | Time: " + timeLeft;

  };

  window.timerLoop =
  setInterval(() => {

    timeLeft--;

    scoreText.innerHTML =
    "Score: " + score +
    " | Time: " + timeLeft;

    if(timeLeft <= 0){

      clearInterval(window.timerLoop);

      alert(
        "⚡ Time Up!\nScore: "
        + score
      );

      saveScore(score);

    }

  },1000);

}

// =========================================
// MEMORY GAME
// =========================================

function startMemoryGame(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "🧠 Memory Match";

  score = 0;

  scoreText.innerHTML =
  "Matches: 0";

  const emojis = [

    "🔥","🔥",
    "🎮","🎮",
    "⚡","⚡",
    "🚀","🚀",
    "🏆","🏆",
    "💎","💎",
    "👾","👾",
    "🧠","🧠"

  ];

  emojis.sort(() =>
  Math.random() - 0.5);

  gameArea.innerHTML = `

    <div class="memory-grid"></div>

  `;

  const grid =
  document.querySelector(".memory-grid");

  let firstCard = null;
  let secondCard = null;
  let lock = false;

  emojis.forEach(emoji => {

    const card =
    document.createElement("div");

    card.classList.add("memory-card");

    card.innerHTML = emoji;

    grid.appendChild(card);

    card.onclick = () => {

      if(lock) return;

      if(card === firstCard) return;

      card.classList.add("show");

      if(!firstCard){

        firstCard = card;

        return;

      }

      secondCard = card;

      if(

        firstCard.innerHTML ===
        secondCard.innerHTML

      ){

        score++;

        scoreText.innerHTML =
        "Matches: " + score;

        firstCard = null;
        secondCard = null;

        if(score === 8){

          alert(
            "🏆 You Win!"
          );

          saveScore(100);

        }

      } else {

        lock = true;

        setTimeout(() => {

          firstCard.classList.remove("show");

          secondCard.classList.remove("show");

          firstCard = null;
          secondCard = null;

          lock = false;

        },700);

      }

    };

  });

}

// =========================================
// SNAKE GAME
// =========================================

function startSnakeGame(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "🐍 Snake Game";

  score = 0;

  scoreText.innerHTML =
  "Score: 0";

  gameArea.innerHTML = `

    <canvas
      id="snakeCanvas"
      width="600"
      height="500"
      style="
        background:black;
        border-radius:10px;
      "
    ></canvas>

  `;

  const canvas =
  document.getElementById("snakeCanvas");

  const ctx =
  canvas.getContext("2d");

  const grid = 20;

  let snake = [

    {x:160,y:160}

  ];

  let food = {

    x:320,
    y:320

  };

  let dx = grid;
  let dy = 0;

  document.onkeydown = e => {

    if(e.key === "ArrowUp" && dy === 0){

      dx = 0;
      dy = -grid;

    }

    if(e.key === "ArrowDown" && dy === 0){

      dx = 0;
      dy = grid;

    }

    if(e.key === "ArrowLeft" && dx === 0){

      dx = -grid;
      dy = 0;

    }

    if(e.key === "ArrowRight" && dx === 0){

      dx = grid;
      dy = 0;

    }

  };

  function drawGame(){

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const head = {

      x: snake[0].x + dx,
      y: snake[0].y + dy

    };

    snake.unshift(head);

    if(

      head.x === food.x &&
      head.y === food.y

    ){

      score++;

      scoreText.innerHTML =
      "Score: " + score;

      food = {

        x:
        Math.floor(
        Math.random()*30
        ) * grid,

        y:
        Math.floor(
        Math.random()*20
        ) * grid

      };

    } else {

      snake.pop();

    }

    ctx.fillStyle = "red";

    ctx.fillRect(
      food.x,
      food.y,
      grid,
      grid
    );

    ctx.fillStyle = "lime";

    snake.forEach(part => {

      ctx.fillRect(
        part.x,
        part.y,
        grid,
        grid
      );

    });

    if(

      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvas.width ||
      head.y >= canvas.height

    ){

      clearInterval(window.gameLoop);

      alert(
        "🐍 Game Over!\nScore: "
        + score
      );

      saveScore(score);

    }

  }

  window.gameLoop =
  setInterval(drawGame,120);

}

// =========================================
// PONG GAME
// =========================================

function startPongGame(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "🏓 Pong";

  score = 0;

  scoreText.innerHTML =
  "Score: 0";

  gameArea.innerHTML = `

    <canvas
      id="pongCanvas"
      width="700"
      height="500"
      style="
        background:black;
        border-radius:10px;
      "
    ></canvas>

  `;

  const canvas =
  document.getElementById("pongCanvas");

  const ctx =
  canvas.getContext("2d");

  let paddleX = 300;

  let ballX = 350;
  let ballY = 250;

  let ballDX = 4;
  let ballDY = 4;

  document.onmousemove = e => {

    const rect =
    canvas.getBoundingClientRect();

    paddleX =
    e.clientX -
    rect.left - 60;

  };

  function draw(){

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "white";

    ctx.fillRect(
      paddleX,
      470,
      120,
      12
    );

    ctx.beginPath();

    ctx.arc(
      ballX,
      ballY,
      10,
      0,
      Math.PI*2
    );

    ctx.fill();

    ballX += ballDX;
    ballY += ballDY;

    if(

      ballX < 10 ||
      ballX > 690

    ){

      ballDX *= -1;

    }

    if(ballY < 10){

      ballDY *= -1;

    }

    if(

      ballY > 460 &&
      ballX > paddleX &&
      ballX < paddleX + 120

    ){

      ballDY *= -1;

      score++;

      scoreText.innerHTML =
      "Score: " + score;

    }

    if(ballY > 500){

      clearInterval(window.gameLoop);

      alert(
        "🏓 Game Over!\nScore: "
        + score
      );

      saveScore(score);

    }

  }

  window.gameLoop =
  setInterval(draw,16);

}

// =========================================
// SPACE SHOOTER
// =========================================

function startSpaceShooter(){

  gameModal.style.display = "flex";

  gameTitle.innerHTML =
  "🚀 Space Shooter";

  score = 0;

  scoreText.innerHTML =
  "Score: 0";

  gameArea.innerHTML = `

    <div id="ship" style="
      position:absolute;
      bottom:20px;
      left:45%;
      width:60px;
      height:60px;
      background:#38bdf8;
      clip-path:polygon(
      50% 0%,
      0% 100%,
      100% 100%
      );
    "></div>

  `;

  const ship =
  document.getElementById("ship");

  let shipX = 45;

  document.onkeydown = e => {

    if(e.key === "ArrowLeft"){

      shipX -= 3;

    }

    if(e.key === "ArrowRight"){

      shipX += 3;

    }

    if(shipX < 0) shipX = 0;

    if(shipX > 90) shipX = 90;

    ship.style.left =
    shipX + "%";

  };

  window.enemyLoop =
  setInterval(() => {

    const enemy =
    document.createElement("div");

    enemy.style.position =
    "absolute";

    enemy.style.width = "40px";

    enemy.style.height = "40px";

    enemy.style.background =
    "red";

    enemy.style.top = "-50px";

    enemy.style.left =
    Math.random()*90 + "%";

    gameArea.appendChild(enemy);

    let enemyY = -50;

    const fall =
    setInterval(() => {

      enemyY += 5;

      enemy.style.top =
      enemyY + "px";

      if(enemyY > 500){

        enemy.remove();

        clearInterval(fall);

        score++;

        scoreText.innerHTML =
        "Score: " + score;

      }

    },30);

  },800);

  setTimeout(() => {

    clearInterval(window.enemyLoop);

    alert(
      "🚀 Mission Complete!\nScore: "
      + score
    );

    saveScore(score);

  },30000);

}
