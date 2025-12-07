// game.js - ATTACH this file to the html above (served from your backend)
(() => {
  // --- Helpers ---
  const el = (id) => document.getElementById(id);
  const generateBoardHTML = (board) => {
    let html = '';
    for(let r=0;r<3;r++){
      html += '<tr>';
      for(let c=0;c<3;c++){
        const val = board && board[r] && board[r][c] ? (board[r][c] === 'P1' ? 'X' : 'O') : '';
        html += `<td data-r="${r}" data-c="${c}">${val}</td>`;
      }
      html += '</tr>';
    }
    return html;
  };
  const roomFromStorage = () => localStorage.getItem('room') || '';

  // --- UI refs ---
  const btnCreate = el('btnCreate');
  const btnJoin = el('btnJoin');
  const joinCode = el('joinCode');
  const roomCodeSpan = el('roomCode');
  const roleSpan = el('role');
  const statusDiv = el('status');
  const boardEl = el('board');
  const turnText = el('turnText');
  const gameArea = el('gameArea');
  const resultDiv = el('result');
  const btnLeave = el('btnLeave');
  const btnRestart = el('btnRestart');
  const lobby = el('lobby');

  // --- state ---
  let socket = null;
  let myRole = null; // 'host' or 'guest'
  let board = [[0,0,0],[0,0,0],[0,0,0]];
  let myPlayerName = "";
  let currentRoom = roomFromStorage();
  let opponentName = '';

  // initial UI values
  if (currentRoom) roomCodeSpan.innerText = currentRoom;


  function setMyName(username){
    myPlayerName =  username;
  }
  function setOpponentName(username){
    opponentName =  username;
  }
  function setMyRole(role){
    if (role === 'P1') role = 'host'
    if (role === 'P2') role = 'guest'
    
    myRole =  role;
  }
  // --- ensure token exists ---
  // You should store auth token in localStorage as 'token' when the user logs in.
  function getToken() {
    return localStorage.getItem('token') || null;
  }

  // Connect socket with token and set handlers
  function connectSocket() {
    if (socket && socket.connected) return socket;
    const token = getToken();
    socket = io("https://game-box.azurewebsites.net",{
      transports: ["websocket"], 
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('SOCKET connected', socket.id);
      statusDiv.innerText = 'Conectado (socket id: ' + socket.id + ')';
    });

    socket.on('connect_error', (err) => {
      console.error('connect_error', err);
      statusDiv.innerText = 'Error conexión: ' + (err && err.message);
    });
    // custom events
    socket.on("playerInfo", ({ self, opponent }) => {
      setMyName(self.username);
      setOpponentName(opponent.username);
      setMyRole(self.role);
    });

    socket.on('roomCreated', (data) => {
      currentRoom = data.code;
      localStorage.setItem('room', currentRoom);
      roomCodeSpan.innerText = currentRoom;
      roleSpan.innerText = 'Host';
      setMyRole('host');
      statusDiv.innerText = 'Sala creada. Esperando oponente...';
    });

    socket.on('roomJoined', (data) => {
      currentRoom = data.code;
      localStorage.setItem('room', currentRoom);
      roomCodeSpan.innerText = currentRoom;
      roleSpan.innerText = data.role === 'P1' ? 'Host' : 'Guest';
      setMyRole(data.role === 'P1' ? 'host' : 'guest');
      statusDiv.innerText = 'Te uniste a la sala ' + currentRoom;
    });

    socket.on('opponentJoined', (data) => {
      setOpponentName(data.opponent.username);
      statusDiv.innerText = 'Oponente conectado: ' + data.opponent.username;
      updateTurnUI();
    });

    socket.on('startGame', (data) => {
      lobby.style.display = "none";
      gameArea.style.display = 'block';
      
      board = data.board || [[0,0,0],[0,0,0],[0,0,0]];
      gameArea.style.display = 'block';
      el('roomCode').innerText = data.code;
      updateBoardUI();
      updateTurnUI(data.currentTurn);
      statusDiv.innerText = 'Partida iniciada';
    });

    socket.on('boardUpdate', (data) => {
      board = data.board;
      updateBoardUI();
      updateTurnUI(data.currentTurn);
    });

    socket.on('gameOver', (data) => {
      updateBoardUI();
      if (data.winner) {
        resultDiv.innerText = `Gana: ${data.winner}`;
      } else {
        resultDiv.innerText = 'Empate';
      }
      if (myRole === 'host') {
        btnRestart.style.display = "block";
      }
      statusDiv.innerText = 'Partida finalizada';
    });

    socket.on("restartGame", (data) => {
      board = data.board;
      updateBoardUI();
      updateTurnUI(data.currentTurn);
      resultDiv.innerText = "";
      statusDiv.innerText = "Nueva partida iniciada";
    });

    
    socket.on('errorMessage', (msg) => {
      console.warn('Error server:', msg);
      statusDiv.innerText = 'Error: ' + msg;
    });

    return socket;
  }

  // UI updates
  function updateBoardUI(){
    boardEl.innerHTML = generateBoardHTML(board);
    // attach click handlers
    boardEl.querySelectorAll('td').forEach(td => {
      td.onclick = () => {
        const r = parseInt(td.dataset.r, 10);
        const c = parseInt(td.dataset.c, 10);
        tryMakeMove(r, c);
      };
    });
  }

  function updateTurnUI(currentTurn) {
    statusDiv.innerText=''
    const meMarker = myRole === 'host' ? 'P1' : 'P2';
    let myName = myPlayerName || 'Yo';
    let otherName = opponentName || 'Oponente';
    if (!currentTurn) {
      turnText.innerText = 'Turno —';
      return;
    }

    const isMyTurn = currentTurn === meMarker;
    const nameToShow = isMyTurn ? myName : otherName;

    turnText.innerText = `Turno de: ${nameToShow}`;
  }

  // Emit create/join/move
  function createRoom() {
    const s = connectSocket();
    s.emit('createRoom', { preferredCode: null /* server generates */ });
  }

  function joinRoom(code) {
    const s = connectSocket();
    s.emit('joinRoom', { code: code.toUpperCase() });
  }

  function tryMakeMove(row, col) {
    if (!socket || !socket.connected) { alert('No conectado'); return; }
    const me = myRole === 'host' ? 'P1' : 'P2';
    socket.emit('playerMove', { code: currentRoom, row, col });
  }

  // leave
  function leaveRoom() {
    if (!socket) return;
    socket.emit('leaveRoom', { code: currentRoom });
    socket.disconnect();
    socket = null;
    localStorage.removeItem('room');
    statusDiv.innerText = 'Has salido';
    gameArea.style.display = 'none';
    btnRestart.style.display = "none";
    lobby.style.display = "block";
    roomCodeSpan.innerText = '—';
    roleSpan.innerText = '—';
  }

  // --- Buttons ---
  btnRestart.onclick = () => {
    if (myRole !== "host") return;
    socket.emit("restartGame", { code: currentRoom });
    btnRestart.style.display = "none";
  };
  btnCreate.onclick = () => {
    createRoom();
  };

  btnJoin.onclick = () => {
    const code = joinCode.value.trim();
    if (!code) { alert('Ingresa código'); return; }
    joinRoom(code);
  };

  btnLeave.onclick = () => leaveRoom();

  // If we already had a room in localStorage, try to re-join passive (optional)
  if (currentRoom && getToken()) {
    // attempt to reconnect silently (user may be host or guest)
    connectSocket();
    // we won't auto-join: need explicit join to avoid duplicates
    roomCodeSpan.innerText = currentRoom;
  }

  // initial blank board UI
  boardEl.innerHTML = generateBoardHTML(board);

})();
