// Angular
import { Component, OnInit } from '@angular/core';

// Matirials
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

//Services
import { StatsService } from '../../shared/services/stats/stats-service';

//directives

//Components
import { IMatch } from '../../shared/types/imatch';
import { UserService } from '../../shared/services/user/user-service';

@Component({
  selector: 'app-stats',
  imports: [MatIconModule,MatButtonModule ],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit{
  matches:IMatch[]=[]
  player_name:String=""
  wins: Number = 0
  constructor (private statsService:StatsService, private userService: UserService){}
  ngOnInit(): void {
    this.player_name 
    this.statsService.getStats().subscribe(data => {
      this.matches = data.stats;
      this.wins = data.wins;
    });
  }
}
