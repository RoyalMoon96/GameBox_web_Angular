import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

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

    //---- Login con servicios
    this.loginService.login(this.email, this.password)
      .then((res) => {

        this.tokenService.setToken(res.token);
        this.userService.setLogueado(true);

        this.snackBar.open('Bienvenido', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      })

      .catch((error) => {
        this.snackBar.open(error.message || 'Error al iniciar sesión', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}
