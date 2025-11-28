import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Materials
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { LoginService } from '../../shared/services/login/login-service';
import { TokenService } from '../../shared/services/token/token-service';
import { UserService } from '../../shared/services/user/user-service';
import { GoogleButton } from './google-button/google-button';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    GoogleButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  isBrowser = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private tokenService: TokenService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login() {
    //---- Validación campos
    if (!this.email || !this.password) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    //---- Login con servicio propio
    this.loginService.login(this.email, this.password)
      .then((res) => {
        console.log("res:")
        console.log(res)
        this.tokenService.setToken(res.token);
        if (this.tokenService.hasToken()){
          this.userService.setLogueado(true);

          this.openSnackBar_Bienvenido();

          this.router.navigate(['/home']);
        }
      })

      .catch((error) => {
        this.snackBar.open(error.message || 'Error al iniciar sesión', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
  }

  openSnackBar_Bienvenido(){
    this.snackBar.open('Bienvenido', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  onGoogleLogin(credential: string) {
  console.log("Token de Google recibido:", credential);

  this.loginService.loginWithGoogle(credential).subscribe({
    next: (res) => {
      console.log("Login con Google OK:", res);
      this.tokenService.setToken(res.token);
      if (this.tokenService.hasToken()){
        this.userService.setLogueado(true);

        this.openSnackBar_Bienvenido();

        this.router.navigate(['/home']);
        }

    },
    error: (err) => {
      console.error("Error en Google Login:", err);
    }
  });
}
}
