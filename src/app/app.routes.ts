import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { Login } from './features/login/login';
import { RegisterForm } from './features/register-form/register-form';
import { AuthGuard } from '../auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { EventosComponent } from './pages/eventos/eventos';
import { EventDetailsComponent } from './features/event-details/event-details';
import { SelectCourseComponent } from './features/select-course/select-course';

export const routes: Routes = [

  // ROTAS PROTEGIDAS
 {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }, 

  {
    path: 'event-form',
    component: EventForm,
    canActivate: [AuthGuard]
  },

  // ROTA PARA VER TODOS OS EVENTOS
  {
    path: 'eventos',
    component: EventosComponent,
    canActivate: [AuthGuard]
  },

  // ROTA DE DETALHES
  {
    path: 'eventos/:id',
    component: EventDetailsComponent,
    canActivate: [AuthGuard]
  },

  // ROTAS APENAS PARA ADMIN
  {
    path: 'admin-panel',
    component: AdminPanel,
    canActivate: [AuthGuard, AdminGuard]
  },

  // ROTA PARA SELECIONAR CURSO (após registro)
  {
    path: 'selecionar-curso',
    component: SelectCourseComponent,
    canActivate: [AuthGuard]
  },

  // ROTAS PÚBLICAS
  {path: 'home', component: HomeComponent},
  { path: 'login', component: Login },
  { path: 'register', component: RegisterForm },

  // REDIRECIONAMENTOS
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
