// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Matirials

//Services
import { GamesManagerService } from '../../shared/services/games-manager/games-manager-service';

//directives

//Components
import { GameCard } from './game-card/game-card';
import { IGame } from '../../shared/types/igame';

@Component({
  selector: 'app-home',
  imports: [GameCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  games_cat1:IGame[]=[]
  games_cat2:IGame[]=[]

  constructor(private router: Router, private gamesManagerService: GamesManagerService) {}
  ngOnInit(): void {
    this.games_cat1=this.gamesManagerService.getGamesByCategory("All")
    this.games_cat2=this.gamesManagerService.getGamesByCategory("BoardGames")
  }

  openGame(game: IGame) {
    this.router.navigate(['/games', game.slug]);
  }
}
