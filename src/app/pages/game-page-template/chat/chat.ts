import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SocketService } from '../../../shared/services/socket/socket-service';
import { IMsg } from '../../../shared/types/imsg';
import { FormsModule } from '@angular/forms';
import { MsgService } from '../../../shared/services/msg/msg-service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  @Input() username: string = ""
  message: string = "";
  messages: IMsg[]; 
  
  SERVER_NAME = MsgService.SERVER_NAME

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
// chat.component.ts (fragmento)
constructor (private socketService: SocketService, private msgService: MsgService) {
  this.messages = this.msgService.getMessages();

  // Suscribirse a mensajes del socket (chat)
  this.socketService.onMessage().subscribe((payload) => {
    // payload: { username: 'User01', msg: 'hola' } por ejemplo
    this.msgService.addMessage({ username: payload.username, msg: payload.msg });
  });

  // opcional: saber cuando se unió el chat
  this.socketService.onChatJoined().subscribe(({ room }) => {
    this.msgService.addMessage({ username: MsgService.SERVER_NAME, msg: `Conectado al chat ${room}` });
  });

  this.socketService.onChatLeft().subscribe(({ room }) => {
    this.msgService.addMessage({ username: MsgService.SERVER_NAME, msg: `Saliste del chat ${room}` });
  });
}

sendMessage() {
  if (!this.message.trim()) return;
  const room = localStorage.getItem('room');
  if (!room) return alert('No estás en ninguna sala de juego/chat');

  this.socketService.sendChatMessage(this.message.trim(), room);
  this.message = '';
}


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.chatContainer?.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      // Silenciar errores iniciales
    }
  }

}
