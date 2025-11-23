import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Services
import { TokenService } from '../token/token-service';
import { Iuser } from '../../types/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<Iuser> = new BehaviorSubject<Iuser>(this.CleanUser());

  constructor(private tokenService: TokenService) {
    ///---- Autenticación si hay token
    const hasToken = this.tokenService.hasToken();
    this.authStatus.next(hasToken);

    if (!hasToken) {
      this.user.next(this.CleanUser());
    }
  }
  CleanUser(){
    return {
      username: '',
      userid: '',
      email: '',
      img: ''
    }
  }

  setUser(user: Iuser): void {
    this.user.next(user)
  }

  setLogueado(status: boolean): void {
    this.authStatus.next(status);
    if (!status) {
      this.user.next(this.CleanUser());
    }
  }

  isLogueado(): boolean {
    return this.authStatus.value;
  }

  logout(): void {
    this.tokenService.removeToken();
    this.user.next(this.CleanUser());
    this.setLogueado(false);
  }
}
