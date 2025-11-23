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
  const playerFromStorage = () => localStorage.getItem('player') || '';

  // --- UI refs ---
  const inputName = el('inputName');
  const btnSaveName = el('btnSaveName');
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

  // --- state ---
  let socket = null;
  let myRole = null; // 'host' or 'guest'
  let board = [[0,0,0],[0,0,0],[0,0,0]];
  let myPlayerName = localStorage.getItem('player') || '';
  let currentRoom = roomFromStorage();

  // initial UI values
  if (myPlayerName) inputName.value = myPlayerName;
  if (currentRoom) roomCodeSpan.innerText = currentRoom;

  // --- ensure token exists ---
  // You should store auth token in localStorage as 'token' when the user logs in.
  function getToken() {
    return localStorage.getItem('token') || null;
  }

  // Connect socket with token and set handlers
  function connectSocket() {
    if (socket && socket.connected) return socket;
    const token = getToken();
    socket = io("http://localhost:3000",{
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
    socket.on('roomCreated', (data) => {
      currentRoom = data.code;
      localStorage.setItem('room', currentRoom);
      roomCodeSpan.innerText = currentRoom;
      roleSpan.innerText = 'Host';
      myRole = 'host';
      statusDiv.innerText = 'Sala creada. Esperando oponente...';
    });

    socket.on('roomJoined', (data) => {
      currentRoom = data.code;
      localStorage.setItem('room', currentRoom);
      roomCodeSpan.innerText = currentRoom;
      roleSpan.innerText = data.role === 'P1' ? 'Host' : 'Guest';
      myRole = data.role === 'P1' ? 'host' : 'guest';
      statusDiv.innerText = 'Te uniste a la sala ' + currentRoom;
    });

    socket.on('opponentJoined', (data) => {
      statusDiv.innerText = 'Oponente conectado: ' + data.opponent.username;
    });

    socket.on('startGame', (data) => {
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
      statusDiv.innerText = 'Partida finalizada';
      // limpiar room local
      localStorage.removeItem('room');
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
    // currentTurn is 'P1' or 'P2'
    const me = myRole === 'host' ? 'P1' : 'P2';
    if (!currentTurn) {
      turnText.innerText = 'Turno: —';
    } else {
      const whose = currentTurn === me ? 'Tu turno' : 'Turno rival';
      turnText.innerText = whose + ` (${currentTurn})`;
    }
  }

  // Emit create/join/move
  function createRoom() {
    if (!inputName.value) { alert('Guarda tu nombre antes'); return; }
    myPlayerName = inputName.value.trim();
    localStorage.setItem('player', myPlayerName);

    const s = connectSocket();
    s.emit('createRoom', { preferredCode: null /* server generates */ });
  }

  function joinRoom(code) {
    if (!inputName.value) { alert('Guarda tu nombre antes'); return; }
    myPlayerName = inputName.value.trim();
    localStorage.setItem('player', myPlayerName);

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
    roomCodeSpan.innerText = '—';
    roleSpan.innerText = '—';
  }

  // --- Buttons ---
  btnSaveName.onclick = () => {
    const name = inputName.value.trim();
    if (!name) return alert('Ingresa un nombre');
    localStorage.setItem('player', name);
    myPlayerName = name;
    alert('Nombre guardado: ' + name);
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
