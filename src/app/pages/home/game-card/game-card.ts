// Angular
import {ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Matirials
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

//Services

//directives

//Components


@Component({
  selector: 'app-game-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss'
})
export class GameCard {
  @Input() gameName: string = ""
  @Input() gameImg: string = ""

}
