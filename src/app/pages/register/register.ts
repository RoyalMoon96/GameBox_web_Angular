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
import { LoginService } from '../../shared/services/login/login-service';
import { TokenService } from '../../shared/services/token/token-service';
import { UserService } from '../../shared/services/user/user-service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  registrar() {
    //---- Validación campos
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    //---- Validación contraseñas
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    //---- registro con servicio propio
    this.loginService.register(this.username, this.email, this.password)
      .then((res) => {
        this.tokenService.setToken(res.token);
        if (this.tokenService.hasToken()){
          this.userService.setLogueado(true);

          this.snackBar.open('¡Registro exitoso! Redirigiendo...', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['/home']);
      }
      })
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
