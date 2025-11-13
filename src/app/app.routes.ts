import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { GamePageTemplate } from './pages/game-page-template/game-page-template';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { UserSettings } from './pages/user-settings/user-settings';
import { Stats } from './pages/stats/stats';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch:"full"},
    {path: "home", component: Home},
    {path: "stats", component: Stats},
    {path: "games/:game", component: GamePageTemplate},
    {path: 'login',component: Login},
    {path: 'register',component: Register},
    {path: 'user-settings',component: UserSettings},
    {path:"**", component: NotFound},
];
