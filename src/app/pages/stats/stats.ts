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

@Component({
  selector: 'app-stats',
  imports: [MatIconModule,MatButtonModule ],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit{
  matches:IMatch[]=[]
  player_name:String=""
  wins:number=1
  constructor (private statsService:StatsService){}
  ngOnInit(): void {
    this.player_name="User1"
    this.matches=this.statsService.getStats()
    this.wins= this.matches.filter((m)=>m.winer==this.player_name).length
  }
}
