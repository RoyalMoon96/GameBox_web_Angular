// Angular
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Matirials
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

//Services
import { GamesManagerService } from '../../shared/services/games-manager/games-manager-service';
import { SocketService } from '../../shared/services/socket/socket-service';
import { MsgService } from '../../shared/services/msg/msg-service';

//directives

//Components
import { Chat } from './chat/chat';
import { IGame } from '../../shared/types/igame';

@Component({
  selector: 'app-game-page-template',
  imports: [Chat, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './game-page-template.html',
  styleUrl: './game-page-template.scss'
})
export class GamePageTemplate implements OnInit {
  srcGame!: SafeResourceUrl;
  loading = true; 
  valid = false; 
  timerId: NodeJS.Timeout|null = null;
  game: IGame;
  similar_games:IGame[]=[]

  username: string;
  connected: boolean = false;
  
  constructor(
    private gamesManagerService: GamesManagerService,
    private socketService: SocketService,
    private msgService: MsgService,
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.game = this.gamesManagerService.getCleanGame();
    this.username= "username"
  }
  
  async ngOnInit() {
    this.valid = false;
    const gameSlug = this.activatedRoute.snapshot.paramMap.get('game');
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const res = await fetch('/game_files/games.json');
      const data = await res.json();
      if (!data.games.includes(gameSlug)) {// lista de juegos válidos games.json -> games
        console.warn('Juego no encontrado en la lista, redirigiendo...');
        this.router.navigate(['/not-found']);
        return;
      }
      // Cargar juego
      const gameUrl = `/game_files/${gameSlug}/index.html`;
      this.srcGame = this.domSanitizer.bypassSecurityTrustResourceUrl(gameUrl);
      this.valid = true;
      this.game = this.gamesManagerService.getGameData(gameSlug || "")
      this.similar_games=this.gamesManagerService.getGamesByCategory(this.game.categorys[0])
    } catch (err) {
      console.error('Error verificando juego:', err);
      this.router.navigate(['/not-found']);
    }
  }
  openGame(game: IGame) {
    this.router.navigate(['/games', game.slug]).then(()=>{
      this.ngOnInit()
    });
  }

  onIframeLoad(){
    if (this.valid) {
      this.loading = false;
      this.connect()
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      return;
    }

    if (!this.timerId) {
      this.timerId = setTimeout(() => {
        this.timerId = null;
        this.onIframeLoad();
      }, 1000);
    }
  }

  connect() {
    if (this.username.trim()) {
      this.socketService.connect(this.username).then(()=>{
        this.connected = true;
        this.socketService.onMessage().subscribe((data) => {
          this.msgService.addMessage(data)
        });
        this.socketService.onUserConnected().subscribe((username) => {
          this.msgService.addMessage({username:MsgService.SERVER_NAME, msg:`${username} se ha conectado`})
        });
        this.msgService.addMessage({username:MsgService.SERVER_NAME, msg:`${this.username} se ha conectado`})

        this.socketService.onUserDisconnected().subscribe((username) => {
          this.msgService.addMessage({username:MsgService.SERVER_NAME, msg:`${username} se ha desconectado`});
        });
      }).catch(()=>{
        alert('No se pudo conectar al servidor.');
      })
    }
  }

}
