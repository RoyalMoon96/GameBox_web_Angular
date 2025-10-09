import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('GameBox_web_Angular');
    nombre: string = "Francisco"; 
  

  constructor() {
    setTimeout( ()=>{
      this.nombre= "Juan";
    }
    ,3000);
  }
}
