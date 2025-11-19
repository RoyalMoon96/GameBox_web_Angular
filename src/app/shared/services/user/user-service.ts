import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Services
import { TokenService } from '../token/token-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private logueado: boolean = false;

  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private tokenService: TokenService) {
    this.logueado = this.tokenService.hasToken();
    this.authStatus.next(this.logueado);
  }

  setLogueado(status: boolean): void {
    this.logueado = status;
    this.authStatus.next(this.logueado);
  }

  isLogueado(): boolean {
    return this.logueado;
  }

  logout(): void {
    this.tokenService.removeToken();
    this.setLogueado(false);
  }
}
