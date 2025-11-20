import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Services
import { TokenService } from '../token/token-service';
import { Iuser } from '../../types/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private logueado: boolean = false;

  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<Iuser> = new BehaviorSubject<Iuser>(this.CleanUser());

  constructor(private tokenService: TokenService) {
    this.logueado = this.tokenService.hasToken();
    this.authStatus.next(this.logueado);
    if (!this.logueado){
      this.user.next(this.CleanUser())
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
    this.logueado = status;
    this.authStatus.next(this.logueado);
    if (!this.logueado){
      this.user.next(this.CleanUser())
    }
  }

  isLogueado(): boolean {
    return this.logueado;
  }

  logout(): void {
    this.tokenService.removeToken();
    this.user.next(this.CleanUser());
    this.setLogueado(false);
  }
}
