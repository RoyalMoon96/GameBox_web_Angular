import { Injectable } from '@angular/core';
import { Ilogin } from '../../types/ilogin';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  login(email:string, password: string): Promise<Ilogin>{
    return new Promise(
      (resolve)=>{
        setTimeout(
          ()=>{
            resolve(
              {token:"213123123j2knbkhvbklknbkb2312sda3da"}
            )
            console.log("Token generado")
          }, 1000
        )
      }
    )
  }
}

