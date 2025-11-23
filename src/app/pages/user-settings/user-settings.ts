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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Services
import { UserService } from '../../shared/services/user/user-service';

// Types
import { Iuser } from '../../shared/types/iuser';

@Component({
  selector: 'app-user-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.scss'
})
export class UserSettings {

  usuario: Iuser;
  nuevoNombre: string = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.usuario = this.userService.CleanUser();
  }

  ngOnInit(): void {
    //---- Suscribirse a la info del usuario
    this.userService.user.subscribe((user) => {
      this.usuario = user;
      this.nuevoNombre = user.username;
    });
  }

  guardarCambios() {
    if (!this.nuevoNombre) {
      this.snackBar.open('El nombre no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.snackBar.open('Cambios guardados', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  //---- Simular guardado de nueva imagen de perfil
  cambiarImagen() {
    this.snackBar.open('En una galaxia muy muy lejana esto cambió la imagen', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
