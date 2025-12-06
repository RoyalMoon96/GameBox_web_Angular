import { Inject, Injectable } from '@angular/core';
import { TokenService } from '../token/token-service';
import { HttpClient } from '@angular/common/http';
import { Iuser } from '../../types/iuser';
import { environment } from '../../../../environments/environment';
import { UserService } from '../user/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  endpoint="update-me"
  newImg: boolean = false;
  file: File | undefined
  username: string =""
  usuario: Iuser;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
    this.usuario = this.userService.CleanUser()
    this.userService.user.subscribe((user) => {
      this.usuario = user;
    });
  }
  setUsername(username: string){
    this.username = username
  }
  setFile(file: File){
    this.file = file
    this.newImg=true
  }
  upload(snackBar: MatSnackBar) {
    if (!(this.file || this.username)) return;
    if (!this.tokenService.hasToken()) return;

    if (this.usuario.username != this.username || this.newImg){
      console.log("uploading...")
      const formData = new FormData();
      if (this.file){
        formData.append('image', this.file );
      }
      if (this.username){
        formData.append('username', this.username );
      }
      this.http.post<Iuser>(
        `${environment.SERVER_URL}/${this.endpoint}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.getToken()}`
          }
        }
      ).subscribe({
        next: 
          (user) => {
            this.userService.setUser(user); // refrescas el usuario
            this.newImg=false
            snackBar.open('Cambios guardados', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            snackBar.open('Ocurrio un error. Intenta nuevamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
        }
      });
    }
  }
}
