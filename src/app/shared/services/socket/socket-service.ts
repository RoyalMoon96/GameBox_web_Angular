// socket-service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;
  private readonly SERVER_URL = environment.SERVER_URL;

  // Subjects para exponer al front
  private msgSubject = new Subject<any>();
  private chatJoinSubject = new Subject<{ room: string }>();
  private chatLeaveSubject = new Subject<{ room: string }>();
  private connectErrorSubject = new Subject<any>();

  // Exponer como observables
  onMessage(): Observable<any> { return this.msgSubject.asObservable(); }
  onChatJoined(): Observable<{ room: string }> { return this.chatJoinSubject.asObservable(); }
  onChatLeft(): Observable<{ room: string }> { return this.chatLeaveSubject.asObservable(); }
  onConnectError(): Observable<any> { return this.connectErrorSubject.asObservable(); }

  // Conecta el socket global (solo UNO)
  connect(username: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) { return resolve(true); }

      this.socket = io(this.SERVER_URL, {
        transports: ['websocket'],
        timeout: 5000,
        auth: { token: localStorage.getItem('token') } // opcional, si usas token
      });

      this.socket.on('connect', () => {
        // opcional: notificar usuario conectado en servidor si lo necesitas
        this.socket?.emit('user_connected', username);
        // start watching localStorage.room
        this.startRoomWatcher();
        resolve(true);
      });

      this.socket.on('connect_error', (err) => {
        this.connectErrorSubject.next(err);
        resolve(false);
      });

      // mensajes de chat (servidor usa 'chatMessage')
      this.socket.on('chatMessage', (payload: any) => {
        this.msgSubject.next(payload);
      });

      // confirmaciones de join/leave
      this.socket.on('chatJoined', (data: { room: string }) => this.chatJoinSubject.next(data));
      this.socket.on('chatLeft', (data: { room: string }) => this.chatLeaveSubject.next(data));
    });
  }

  // Envia mensaje al chat actual (server espera 'chatMessage')
  sendChatMessage(text: string, roomCode: string) {
    if (!this.socket || !this.socket.connected) return;
    const chatRoom = this.toChatRoom(roomCode);
    this.socket.emit('chatMessage', { room: chatRoom, msg: text });
  }

  // ---- Room control ----
  private currentJoinedRoom: string | null = null;

  // Convierto código de juego a chat-room (prefijo/sufijo)
  private toChatRoom(roomCode: string|null) {
    if (!roomCode) return null;
    return `chat-${roomCode.toUpperCase()}`;
  }

  // Únete a una sala de chat (interno)
  private joinChatRoom(roomCode: string|null) {
    if (!this.socket || !this.socket.connected) return;
    const chatRoom = this.toChatRoom(roomCode);
    if (!chatRoom) return;

    // si ya estamos en la misma sala, ignorar
    if (this.currentJoinedRoom === chatRoom) return;

    // si estamos en otra sala, salimos primero
    if (this.currentJoinedRoom) {
      this.leaveChatRoom(this.currentJoinedRoom.replace(/^chat-/, ''));
    }

    this.socket.emit('joinChatRoom', { room: chatRoom });
    this.currentJoinedRoom = chatRoom;
  }

  // Dejar sala de chat
  private leaveChatRoom(roomCode: string|null) {
    if (!this.socket || !this.socket.connected) return;
    const chatRoom = this.toChatRoom(roomCode);
    if (!chatRoom) return;
    this.socket.emit('leaveChatRoom', { room: chatRoom });
    if (this.currentJoinedRoom === chatRoom) this.currentJoinedRoom = null;
  }

  // ---- Watch localStorage.room ----
  private startRoomWatcher() {
    // Handle cross-tab changes
    window.addEventListener('storage', (ev) => {
      if (ev.key === 'room') {
        const newRoom = ev.newValue;
        this.handleRoomChange(newRoom);
      }
    });

    // Patch localStorage.setItem to capture same-tab changes (safe override)
    const originalSet = localStorage.setItem.bind(localStorage);
    const self = this as any;
    localStorage.setItem = function(key: string, value: string) {
      originalSet(key, value);
      if (key === 'room') {
        self.handleRoomChange(value);
      }
    };

    // Also react to initial value
    const initial = localStorage.getItem('room');
    if (initial) this.handleRoomChange(initial);
  }

  // Called on room changes
  private handleRoomChange(roomValue: string | null) {
    const normalized = (roomValue || '').trim();
    if (!normalized) {
      // if empty -> leave current chat room
      if (this.currentJoinedRoom) {
        const oldRoom = this.currentJoinedRoom.replace(/^chat-/, '');
        this.leaveChatRoom(oldRoom);
      }
      return;
    }
    // join the new one
    this.joinChatRoom(normalized);
  }

  disconnect() {
    if (this.socket) {
      if (this.currentJoinedRoom) {
        const r = this.currentJoinedRoom.replace(/^chat-/, '');
        this.leaveChatRoom(r);
      }
      this.socket.disconnect();
      this.socket = undefined;
      this.currentJoinedRoom = null;
    }
  }
}
