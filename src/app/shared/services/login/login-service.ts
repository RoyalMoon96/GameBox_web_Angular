import { inject, Injectable } from '@angular/core';
import { Ilogin } from '../../types/ilogin';
import { environment } from '../../../../environments/environment';
import { UserService } from '../user/user-service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userService = inject(UserService);
  private http = inject(HttpClient);

  login(email:string, password: string): Promise<Ilogin>{
    return new Promise(
      async (resolve)=>{
        const res =await fetch(`${environment.SERVER_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "email":email, 
            "password":password 
          })
        });
        try {
          const json = JSON.parse(await res.text());
          if (json.user){
            this.userService.setUser(json.user)
          }
          resolve(json);
        } catch (e) {
          console.error("Error parseando JSON de registro");
          resolve({token:""});
        }
      }
    ) 
  }
  loginWithGoogle(credential: string) {
    return this.http.post<Ilogin>(
      `${environment.SERVER_URL}/auth/google`,
      { credential }
    ).pipe(
      tap((res: Ilogin) => {
        if (res.user) {
          console.log(res.user)
          console.log(res)
          this.userService.setUser(res.user);
        }
      })
    );
  }


  register(username:string ,email:string, password: string): Promise<Ilogin>{
    return new Promise(
      async (resolve)=>{
        const res =await fetch(`${environment.SERVER_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            email:email,
            password: password
          })
        });
        try {
          const json = JSON.parse(await res.text());
          if (json.user){
            this.userService.setUser(json.user)
          }
          resolve(json);
        } catch (e) {
          console.error("Error parseando JSON de registro");
          resolve({token:""});
        }
      }
    ) 
  }
}

