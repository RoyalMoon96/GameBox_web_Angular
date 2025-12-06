import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

// Services
import { TokenService } from '../token/token-service';
import { Iuser } from '../../types/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_STORAGE_KEY = 'user';

  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<Iuser> = new BehaviorSubject<Iuser>(this.CleanUser());

  constructor(
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    ///--- Autenticación si hay token
    const hasToken = this.tokenService.hasToken();
    this.authStatus.next(hasToken);

    if (hasToken) {
      ///--- Si hay token, cargar el usuario del localStorage
      const storedUser = this.getUserFromStorage();
      if (storedUser) {
        this.user.next(storedUser);
      }
    } else {
      this.user.next(this.CleanUser());
      this.removeUserFromStorage();
    }
  }

  CleanUser(): Iuser {
    return {
      username: '',
      userid: '',
      email: '',
      img: ''
    }
  }

  setUser(user: Iuser): void {
    this.user.next(user);
    this.saveUserToStorage(user);
  }

  setLogueado(status: boolean): void {
    this.authStatus.next(status);
    if (!status) {
      this.user.next(this.CleanUser());
      this.removeUserFromStorage();
    }
  }

  isLogueado(): boolean {
    return this.authStatus.value;
  }

  logout(): void {
    this.tokenService.removeToken();
    this.user.next(this.CleanUser());
    this.removeUserFromStorage();
    this.setLogueado(false);
  }


  ///--- Guradado de la info del usuario en el local storage
  private saveUserToStorage(user: Iuser): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  ///-- Obtener la info
  private getUserFromStorage(): Iuser | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as Iuser;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          this.removeUserFromStorage();
          return null;
        }
      }
    }
    return null;
  }

  //--- Remover la info
  private removeUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }
}
