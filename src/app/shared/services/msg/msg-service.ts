import { Injectable } from '@angular/core';
import { IMsg } from '../../types/imsg';

@Injectable({
  providedIn: 'root',
})
export class MsgService {
  public static SERVER_NAME= "Server"

  private messages: IMsg[]=[]

  addMessage(msg_data: IMsg){
    this.messages.push(msg_data)
  }
  getMessages(){
    return this.messages
  }
}
