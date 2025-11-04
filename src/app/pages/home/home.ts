// Angular
import { Component } from '@angular/core';

// Matirials

//Services

//directives

//Components
import { GameCard } from './game-card/game-card';

@Component({
  selector: 'app-home',
  imports: [GameCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  games_cat1=[
    {name:"Tic Tac Toe", img_url:"https://t4.ftcdn.net/jpg/04/23/42/55/360_F_423425529_Ry6bKSuIhrOqnfBrMYghKZOVtyUqktQ1.jpg"},
    {name:"Connect 4", img_url:"https://s7d9.scene7.com/is/image/OCProduction/fg653?wid=800&hei=600"},
    {name:"Snake", img_url:"https://hackster.imgix.net/uploads/attachments/1247634/_FmqeflH6CR.blob?auto=compress%2Cformat&w=400&h=300&fit=min"},
    {name:"Game 4", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 5", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 6", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 7", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 8", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 9", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"}
  ]
  games_cat2=[
    {name:"Game 1", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 3", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 4", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 6", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"},
    {name:"Game 9", img_url:"https://material.angular.dev/assets/img/examples/shiba2.jpg"}
  ]

}
