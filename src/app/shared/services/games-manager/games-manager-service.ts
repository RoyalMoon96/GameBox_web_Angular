import { Injectable } from '@angular/core';
import { IGame } from '../../types/igame';

@Injectable({
  providedIn: 'root'
})
export class GamesManagerService {

  getCleanGame(): IGame {
    return{
      name:"",
      categorys:[],
      slug: '',
      img_url:"",
      description:""
    }
  }
    allGames: IGame[]=[
    {name:"Tic Tac Toe", categorys:["BoardGames","Clasics"], slug: 'gato', description:"Coloca tus fichas estratégicamente para formar una línea antes que tu oponente en este clásico desafío de lógica y rapidez.", img_url:"https://t4.ftcdn.net/jpg/04/23/42/55/360_F_423425529_Ry6bKSuIhrOqnfBrMYghKZOVtyUqktQ1.jpg"},
    {name:"Connect 4", categorys:["BoardGames","Clasics"], description:"Deja caer tus fichas y conecta cuatro en línea para ganar. Un juego de estrategia simple pero adictivo que pondrá a prueba tu anticipación.", slug: 'conecta4', img_url:"https://s7d9.scene7.com/is/image/OCProduction/fg653?wid=800&hei=600"},
    {name:"Snake", categorys:["Clasics"], slug: 'snake', description:"Controla la serpiente mientras crece con cada bocado. Evita chocar contigo mismo y trata de alcanzar la puntuación más alta posible.", img_url:"https://hackster.imgix.net/uploads/attachments/1247634/_FmqeflH6CR.blob?auto=compress%2Cformat&w=400&h=300&fit=min"},
    {name:"Error page", categorys:[], slug: 'a', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 5", categorys:[], slug: 'snake', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 6", categorys:[], slug: 'snake', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 7", categorys:[], slug: 'snake', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 8", categorys:[], slug: 'snake', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 9", categorys:[], slug: 'snake', description:"", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"}
  ]
  categorys_getList: Record<string, ()=>IGame[] > ={
    "All": this.getAll.bind(this),
    "BoardGames": this.getBoardGames.bind(this),
    "Clasics": this.getClasics.bind(this),
  }
  getGamesByCategory(category:string):IGame[]{
    return this.categorys_getList[category]?this.categorys_getList[category](): []
  }

  getAll():IGame[]{
    return this.allGames
  }
  getBoardGames():IGame[]{
    return this.allGames.filter((game)=>game.categorys.includes("BoardGames"))
  }
  getClasics():IGame[]{
    return this.allGames.filter((game)=>game.categorys.includes("Clasics"))
  }
  getGameData(slug:string):IGame{
    return this.allGames.find((game)=>game.slug==slug) || this.getCleanGame()
  }

}
