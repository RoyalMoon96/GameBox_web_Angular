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
  
  constructor (private socketService: SocketService, private msgService:MsgService){
    this.messages = this.msgService.getMessages()
  }

  sendMessage() {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message, this.username);
      this.message = '';
    }
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
