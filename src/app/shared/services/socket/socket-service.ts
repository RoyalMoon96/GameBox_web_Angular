import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IMsg } from '../../types/imsg';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly SERVER_URL = environment.SERVER_URL; 

  connect(username: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket = io(this.SERVER_URL, {
        transports: ['websocket'],
        timeout: 5000
      });
      this.socket.on('connect', () => {
        console.log('Conectado al servidor Socket.IO');
        this.socket?.emit('user_connected', username);
        resolve(true);
      });

      this.socket.on('connect_error', (err) => {
        console.error('Error al conectar con el servidor:', err.message);
        resolve(false);
      });
      this.socket.on('disconnect', (reason) => {
        console.warn('Desconectado del servidor:', reason);
      });
    });
  }
  onUserDisconnected(): Observable<string> {
  return new Observable(observer => {
    this.socket?.on('user_disconnected', (username) => observer.next(username));
  });
}

  sendMessage(msg: string, username: string): void {
    if (this.socket) {
      this.socket.emit('message', { username, msg });
    }
  }
  onMessage(): Observable<IMsg> {
    return new Observable(observer => {
      this.socket?.on('message', data_msg => observer.next(data_msg));
    });
  }

  onUserConnected(): Observable<string> {
    return new Observable(observer => {
      this.socket?.on('user_connected', username => observer.next(username));
    });
  }
}