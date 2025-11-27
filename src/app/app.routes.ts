import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { GamePageTemplate } from './pages/game-page-template/game-page-template';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { UserSettings } from './pages/user-settings/user-settings';
import { Stats } from './pages/stats/stats';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch:"full"},
    {path: 'login',component: Login},
    {path: 'register',component: Register},
    {path: "home", component: Home, canActivate: [authGuard]},
    {path: "stats", component: Stats, canActivate: [authGuard]},
    {path: "games/:game", component: GamePageTemplate, canActivate: [authGuard]},
    {path: 'user-settings',component: UserSettings, canActivate: [authGuard]},
    {path:"**", component: NotFound},
];
