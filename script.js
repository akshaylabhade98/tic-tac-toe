const gameBoard = document.getElementById("game");
const statusText = document.getElementById("status");
const xScoreDisplay = document.getElementById("xScore");
const oScoreDisplay = document.getElementById("oScore");
const drawsDisplay = document.getElementById("draws");

const playerXInput = document.getElementById("playerXName");
const playerOInput = document.getElementById("playerOName");

const playerXLabel = document.getElementById("playerXLabel");
const playerOLabel = document.getElementById("playerOLabel");

const gameContainer = document.getElementById("game-container");

const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");


let playerX = "";
let playerO = "";
let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = false;



const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Load player names and scores from localStorage if available
let scores = JSON.parse(localStorage.getItem("ticTacToeScores")) || {
  X: 0,
  O: 0,
  Draws: 0
};

function updateScoreUI() {
  xScoreDisplay.textContent = scores.X;
  oScoreDisplay.textContent = scores.O;
  drawsDisplay.textContent = scores.Draws;
}

function saveScores() {
  localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
}

function startGame() {
  playerX = playerXInput.value.trim() || "Player X";
  playerO = playerOInput.value.trim() || "Player O";

  localStorage.setItem("playerX", playerX);
  localStorage.setItem("playerO", playerO);

  playerXLabel.textContent = playerX;
  playerOLabel.textContent = playerO;

  document.getElementById("player-setup").style.display = "none";
  gameContainer.style.display = "block";

  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `${playerX}'s Turn`;

  initializeBoard();
  updateScoreUI();
}

function initializeBoard() {
  board = Array(9).fill("");
  gameBoard.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    gameBoard.appendChild(cell);
  }
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("clicked");
  clickSound.play();

  if (checkWin()) {
    winSound.play();
    const winnerName = currentPlayer === "X" ? playerX : playerO;
    const winningCombo = getWinningCombo();
    highlightWinners(winningCombo);
    scores[currentPlayer]++;
    saveScores();
    updateScoreUI();
    statusText.textContent = `🎉 ${winnerName} Wins!`;

    gameActive = false;
    
  } else if (board.every(cell => cell !== "")) {
    drawSound.play(); 
    scores.Draws++;
    saveScores();
    updateScoreUI();
    statusText.textContent = "It's a Draw!";
    
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const nextPlayer = currentPlayer === "X" ? playerX : playerO;
    statusText.textContent = `${nextPlayer}'s Turn`;
  }
}

function checkWin() {
  return winConditions.some(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function getWinningCombo() {
  return winConditions.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function highlightWinners(combo) {
  combo.forEach(index => {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.classList.add("winner");
  });
}

function restartGame() {
  // Always restart, regardless of whether game ended
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `${playerX}'s Turn`;
  initializeBoard();
}

function resetScores() {
  scores = { X: 0, O: 0, Draws: 0 };
  saveScores();
  updateScoreUI();
}
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("ticTacToeTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Load dark mode if saved
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("ticTacToeTheme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});