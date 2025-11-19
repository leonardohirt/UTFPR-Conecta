import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { Login } from './features/login/login';
import { RegisterForm } from './features/register-form/register-form';
import { AuthGuard } from '../auth.guard';// 1. O caminho do seu AuthGuard deve ser './guards/auth.guard'

export const routes: Routes = [
  
  // Rotas Protegidas: Usam o AuthGuard para verificar o login
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard] // 🛡️ Aplica a proteção
  },

  // Rotas Públicas: Acessíveis a todos
  { path: 'login', component: Login },
  { path: 'register', component: RegisterForm },
  { path: 'event-form', component: EventForm},
  
  // Redirecionamento Padrão:
  // Se acessar a rota raiz ('/'), redireciona para 'home' (que será protegida)
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Redirecionamento de rotas não encontradas
  // Se uma rota for inválida, redireciona para 'home'
  { path: '**', redirectTo: 'home' } 
];