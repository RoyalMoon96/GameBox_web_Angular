// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Matirials
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//Services

//directives

//Components


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  cuenta: number = 10;
  isLogeado: boolean = false

  constructor(){}

}
