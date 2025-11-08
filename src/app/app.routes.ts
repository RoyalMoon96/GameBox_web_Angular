import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { GamePageTemplate } from './pages/game-page-template/game-page-template';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch:"full"},
    {path: "home", component: Home},
    {path: "games/:game", component: GamePageTemplate},
    {path:"**", component: NotFound},
];
