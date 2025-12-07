//----------------------------------------
// game.js  (Snake)
//----------------------------------------

let socket = null;
let currentRoom = null;
let myRole = null;
let opponentName = "";
let gameRunning = false;

const SERVER_URL = "https://game-box.azurewebsites.net";

// UI refs
const lobby = document.getElementById("lobby");
const gameArea = document.getElementById("gameArea");
const roomCodeSpan = document.getElementById("roomCode");
const statusDiv = document.getElementById("status");
const roleSpan = document.getElementById("role");
const resultDiv = document.getElementById("result");
const btnLeave = document.getElementById("btnLeave");
/* const btnRestart = document.getElementById("btnRestart");
 */
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

//--------------------------
//   TOKEN
//--------------------------
function getToken() {
  return localStorage.getItem("token") || null;
}

//--------------------------
//      LEAVE ROOM
//--------------------------
btnLeave.onclick = () => leaveRoom();

function leaveRoom() {
  if (socket) {
    socket.emit("leaveRoom", { code: currentRoom });
    socket.disconnect();
  }

  socket = null;
  localStorage.removeItem("room");
  currentRoom = null;

  gameRunning = false;
  gameArea.style.display = "none";
  lobby.style.display = "block";
/*   btnRestart.style.display = "none";
 */
  roomCodeSpan.innerText = "—";
  roleSpan.innerText = "—";
  statusDiv.innerText = "Has salido";
}

/* //--------------------------
//    RESTART
//--------------------------
btnRestart.onclick = () => {
  if (myRole !== "host") return;
  socket.emit("restartGame", { code: currentRoom });
  btnRestart.style.display = "none";
};
 */
//--------------------------
//     SOCKET CONNECT
//--------------------------
function connectSocket() {
  if (socket && socket.connected) return socket;

  const token = getToken();

  socket = io(SERVER_URL, {
    transports: ["websocket"],
    auth: { token }
  });

  socket.on("connect", () => {
    statusDiv.innerText = "Conectado (id: " + socket.id + ")";
  });

  socket.on("connect_error", (err) => {
    statusDiv.innerText = "Error conexión: " + err.message;
  });

  //--------------------------------------------------------------------
  // ROOM EVENTS
  //--------------------------------------------------------------------
  socket.on("roomCreated", (data) => {
    currentRoom = data.code;
    localStorage.setItem("room", currentRoom);

    roomCodeSpan.innerText = currentRoom;
    roleSpan.innerText = "Host";
    myRole = "host";

    statusDiv.innerText = "Sala creada. Esperando oponente…";
  });

  socket.on("roomJoined", (data) => {
    currentRoom = data.code;
    localStorage.setItem("room", currentRoom);

    roomCodeSpan.innerText = currentRoom;

    roleSpan.innerText = "Guest";
    myRole = "guest";

    statusDiv.innerText = "Te uniste a la sala " + currentRoom;
  });

  socket.on("opponentJoined", (data) => {
    opponentName = data.opponent.username;
    statusDiv.innerText = "Oponente conectado: " + opponentName;
  });

  //--------------------------------------------------------------------
  // GAME EVENTS
  //--------------------------------------------------------------------

  socket.on("startGame", (data) => {
    console.log("startGame")
    lobby.style.display = "none";
    gameArea.style.display = "block";

    document.getElementById("game").style.display = "block";  // ⭐

    resultDiv.innerText = "";
    gameRunning = true;

    startSnakeGame(data);
});

  socket.on("stateUpdate", (state) => {
    updateSnakeState(state);
  });

  socket.on("gameOver", (data) => {
    gameRunning = false;
    resultDiv.innerText =
      data.winner? "Gano: "+data.winner : "Fin del Juego";

/*     if (myRole === "host") btnRestart.style.display = "block";
 */  });

  socket.on("errorMessage", (msg) => {
    statusDiv.innerText = "Error: " + msg;
  });

  return socket;
}

//--------------------------
//     CREATE ROOM
//--------------------------
function createRoom() {
  const s = connectSocket();
  s.emit("createRoom", { preferredCode: null });
}

//--------------------------
//     JOIN ROOM
//--------------------------
function joinRoom() {
  const code = document.getElementById("roomId").value.trim();
  if (!code) return alert("Ingresa un código");

  const s = connectSocket();
  s.emit("joinRoom", { code });
  console.log(`joining room ${code}...`)
}

//---------------------------------------------------------
//   CANVAS GAME
//---------------------------------------------------------
let currentState = null;

function userInputs(ev) {
  if (!socket || !gameRunning) return;

  const key = ev.key.toLowerCase();

  const dirs = {
    arrowup: "up",
    w: "up",

    arrowdown: "down",
    s: "down",

    arrowleft: "left",
    a: "left",

    arrowright: "right",
    d: "right",
  };

  const dir = dirs[key];
  if (dir) {
    ev.preventDefault();   // evita interferencias del navegador
    socket.emit("moveSnake", { dir });
  }
}

document.addEventListener("keydown", userInputs, { passive: false });

function startSnakeGame() {
    gameRunning=true
    canvas.setAttribute("tabindex", "0");
    canvas.focus();
    canvas.onclick = () => canvas.focus();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateSnakeState(state) {
  currentState = state;
  draw();
}

function draw() {
  if (!currentState) return;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(currentState.food.x, currentState.food.y, 15, 15);

  // players
  ctx.fillStyle = "lime";

currentState.players.forEach((p) => {
  if (!p.alive) return;

  // cabeza
  ctx.fillRect(p.x, p.y, 15, 15);

  // cola
  p.tail.forEach(seg => {
    ctx.fillRect(seg.x, seg.y, 15, 15);
  });
});
}
