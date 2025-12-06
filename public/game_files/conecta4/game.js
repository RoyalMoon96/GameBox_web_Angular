(() => {

const $ = id => document.getElementById(id);

// UI REFS
const btnCreate = $('btnCreate');
const btnJoin = $('btnJoin');
const joinCode = $('joinCode');
const roomCodeSpan = $('roomCode');
const roleSpan = $('role');
const statusDiv = $('status');
const btnSaveName = $('btnSaveName');
const meNameSpan = $('meName');
const opNameSpan = $('opName');

const gameArea = $('gameArea');
const boardContainer = $('boardContainer');
const boardEl = $('board');
const animLayer = $('animLayer');
const turnText = $('turnText');
const btnRestart = $('btnRestart');
const btnLeave = $('btnLeave');
const resultDiv = $('result');

let socket = null;
let currentRoom = localStorage.getItem('room') || null;
let myName = localStorage.getItem('player') || '';
let myMarker = null; // P1 / P2
let board = Array.from({ length: 6 }, () => Array(7).fill(0));

gameArea.style.visibility = "hidden"
lobby.style.visibility = "visible"

// ----------------------------
// SOCKET
// ----------------------------
function connectSocket() {
  if (socket && socket.connected) return socket;

  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    auth: { token: localStorage.getItem("token") }
  });

  socket.on("connect", () => {
    statusDiv.textContent = "Conectado ✔";
  });

  socket.on("roomCreatedC4", data => {
    currentRoom = data.code;
    localStorage.setItem("room", currentRoom);
    roomCodeSpan.textContent = currentRoom;

    myMarker = "P1";
    roleSpan.textContent = "Host";

    statusDiv.textContent = "Sala creada. Esperando jugador...";
  });

  socket.on("roomJoinedC4", data => {
    currentRoom = data.code;
    localStorage.setItem("room", currentRoom);

    roomCodeSpan.textContent = currentRoom;
    statusDiv.textContent = "Unido a sala " + currentRoom;
  });

  socket.on("playerInfoC4", ({ self, opponent }) => {
    myMarker = self.role; // 'P1' or 'P2'

    meNameSpan.textContent = self.username;
    opNameSpan.textContent = opponent.username || "Oponente";

    roleSpan.textContent = self.role === "P1" ? "Host" : "Guest";
  });

  socket.on("startGameC4", data => {
    gameArea.style.visibility = "visible";
    lobby.style.visibility = "hidden";
    board = data.board;
    $("lobby").style.display = "none";
    gameArea.style.display = "block";

    resultDiv.textContent = "";
    renderBoard();
    updateTurn(data.currentTurn);
  });

  socket.on("boardUpdateC4", data => {
    board = data.board;

    animateDrop(data.col, data.row, data.value);
    updateTurn(data.currentTurn);
  });

  socket.on("gameOverC4", data => {
    resultDiv.textContent = data.winner ? "Ganador: " + data.winner : "Empate";

    if (myMarker === "P1") btnRestart.style.display = "inline-block";
  });

  socket.on("restartGameC4", data => {
    board = data.board;
    resultDiv.textContent = "";
    btnRestart.style.display = "none";
    renderBoard();
    updateTurn(data.currentTurn);
  });

  return socket;
}

// ----------------------------
// LÓGICA UI
// ----------------------------
function renderBoard() {
  boardEl.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.onclick = () => playColumn(c);

      if (board[r][c] !== 0) {
        const disc = document.createElement("div");
        disc.className = "disc " + board[r][c];
        cell.appendChild(disc);
      } else {
        const blank = document.createElement("div");
        blank.className = "disc " + "blank";
        cell.appendChild(blank);

      }

      boardEl.appendChild(cell);
    }
  }
}

function updateTurn(currentTurn) {
  turnText.textContent = myMarker === currentTurn ? meNameSpan.textContent : opNameSpan.textContent;
}

// ----------------------------
// MOVIMIENTOS
// ----------------------------
function playColumn(col) {
  if (!socket || !currentRoom) return;

  socket.emit("playerMoveC4", {
    code: currentRoom,
    column: col
  });
}

// ----------------------------
// ANIMACIÓN
// ----------------------------
function animateDrop(col, row, player) {
/* 
  const targetCell = document.querySelector(`.cell[data-col="${col}"][data-row="${row}"]`);
  if (!targetCell) return;

  const cellRect = targetCell.getBoundingClientRect();
  const boardRect = boardEl.getBoundingClientRect();

  const disc = document.createElement("div");
  disc.className = "discAnim " + player;

  animLayer.appendChild(disc);

  const discX = cellRect.left + cellRect.width/2 - disc.offsetWidth/2;
  const startY = boardRect.top - 90;
  const endY = cellRect.top + cellRect.height/2 - 35;

  disc.style.left = discX + "px";
  disc.style.top = startY + "px";

  disc.animate([
    { transform: "translateY(0)" },
    { transform: `translateY(${endY - startY}px)` }
  ], {
    duration: 600,
    easing: "cubic-bezier(.22,.9,.3,1)"
  }).onfinish = () => {
    disc.remove();
    renderBoard();
    }; */
    renderBoard();
}

// ----------------------------
// BOTONES
// ----------------------------
btnCreate.onclick = () => {
  const s = connectSocket();
  s.emit("createRoomC4", {});
};

btnJoin.onclick = () => {
  const code = joinCode.value.trim().toUpperCase();
  if (!code) return alert("Ingresa código");

  const s = connectSocket();
  s.emit("joinRoomC4", { code });
};

btnRestart.onclick = () => {
  if (myMarker !== "P1") return alert("Solo el host puede reiniciar");
  socket.emit("restartGameC4", { code: currentRoom });
};

btnLeave.onclick = () => {
  if (socket && currentRoom) {
    socket.emit("leaveRoomC4", { code: currentRoom });
  }

  localStorage.removeItem("room");
  location.reload();
};

btnSaveName.onclick = () => {
  const name = inputName.value.trim();
  if (name) {
    localStorage.setItem("player", name);
    alert("Nombre guardado");
  }
};

})();
