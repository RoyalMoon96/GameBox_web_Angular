// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Matirials
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

//Services
import { UserService } from '../../shared/services/user/user-service';

//directives
import { Auth } from '../../shared/directives/auth';
import { Iuser } from '../../shared/types/iuser';
import { Observable } from 'rxjs';

//Components


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatDividerModule, MatSnackBarModule, Auth],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  cuenta: number = 10;
  isLogeado: boolean = false


  usuario: Iuser

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ){
    this.usuario = this.userService.CleanUser()
  }
  ngOnInit(): void {
    //---- Suscribirse al estado de autenticación
    this.userService.authStatus.subscribe((status) => {
      this.isLogeado = status;
    });
    //---- Suscribirse a la info del usuario
    this.userService.user.subscribe((user) => {
      this.usuario = user;
    });
  }

  irAHome() {
    this.router.navigate(['/home']);
    console.log('HOME');
  }

  irAStats() {
    this.router.navigate(['/stats']);
    console.log('STATS');
  }

  irALogin() {
    this.router.navigate(['/login']);
    console.log('LOGIN');
  }

  irAConfiguracion() {
    this.router.navigate(['/user-settings']);
    console.log('SETTINGS');
  }

  cerrarSesion() {
    //---- Cerrar sesión con servicio
    this.userService.logout();
    console.log('BABAY');

    this.irALogin()

    this.snackBar.open('Hasta la próxima', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
