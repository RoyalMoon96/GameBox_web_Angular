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

//Services

//directives

//Components


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatDividerModule],
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


  constructor(private router: Router){}

  irAHome() {
    this.router.navigate(['/home']);
    console.log('HOME');
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
    //---- Simular cerrar sesión
    console.log('BABAY');
    this.isLogeado = false;
    this.router.navigate(['/login']);
  }

}
