// Angular
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Matirials
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

//Services
import { GamesManagerService } from '../../shared/services/games-manager/games-manager-service';
import { SocketService } from '../../shared/services/socket/socket-service';
import { MsgService } from '../../shared/services/msg/msg-service';
import { RoomWatcherService } from '../../shared/services/socket/storage-watcher.service';

//directives

//Components
import { Chat } from './chat/chat';
import { IGame } from '../../shared/types/igame';

@Component({
  selector: 'app-game-page-template',
  imports: [Chat, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
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

  currentChatRoom: string = '';

  constructor(
    private gamesManagerService: GamesManagerService,
    private socketService: SocketService,
    private msgService: MsgService,
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private domSanitizer: DomSanitizer,
    private roomWatcherService: RoomWatcherService,

    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.game = this.gamesManagerService.getCleanGame();
    this.username= "username"
  }
  
  async ngOnInit() {
    this.valid = false;
    const gameSlug = this.activatedRoute.snapshot.paramMap.get('game');
    if (!isPlatformBrowser(this.platformId)) return;
    

    if (localStorage){
      localStorage.removeItem("room")
    }

    this.roomWatcherService.room$.subscribe(room => {
      if (room) {
        const chatRoom = `${room}_chat`;

        if (chatRoom !== this.currentChatRoom) {
          this.currentChatRoom = chatRoom;
          this.joinChatRoom(chatRoom);
        }
      }
    });

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
  joinChatRoom(room: string) {
    this.socketService.connect(this.username).then(()=>console.log(`Chat conectado al room: ${room}`));
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
    this.socketService.connect(this.username).then((ok) => {
      this.connected = !!ok;
      if (!ok) {
        console.warn('No se pudo conectar socket de chat');
      }
    }).catch(() => {
      alert('No se pudo conectar al servidor.');
    });
  }
}
}
