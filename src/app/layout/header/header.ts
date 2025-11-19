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
import { TokenService } from '../../shared/services/token/token-service';

//directives
import { Auth } from '../../shared/directives/auth';

//Components


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatDividerModule, MatSnackBarModule, Auth],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  cuenta: number = 10;
  isLogeado: boolean = true

  //---- Info del usuario HardCodeada
  usuario = {
    nombre: 'PptoClvUnClvto',
    email: 'enlacalva@deuncalvito.com',
    avatar: 'https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720'
  };


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private tokenService: TokenService
  ){}

  ngOnInit(): void {
    //---- Suscribirse al estado de autenticación
    this.userService.authStatus.subscribe((status) => {
      this.isLogeado = status;
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

    this.router.navigate(['/home']);

    this.snackBar.open('Hasta la próxima', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
