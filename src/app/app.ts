import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin && event.data?.type === 'redirect') {
          this.router.navigateByUrl(event.data.route);
        }
      });
    }
  }
}