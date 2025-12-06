import { AfterViewInit, Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-google-button',
  imports: [],
  templateUrl: './google-button.html',
  styleUrl: './google-button.scss',
})
export class GoogleButton implements AfterViewInit {

  @Output() googleLogin = new EventEmitter<any>();  

  loadGoogleScript(): Promise<void> {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async ngAfterViewInit() {
    await this.loadGoogleScript();

    google.accounts.id.initialize({
      client_id: environment.CLIENT_ID,
      callback: (response: any) => {
        this.googleLogin.emit(response.credential); 
      },
    });

    // Renderizar botón
    const btn = document.getElementById('googleBtn');
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: 'filled_blue',
        size: 'large',
        type: 'standard',
        shape: 'pill'
      });
    }
  }
}
