import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
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
