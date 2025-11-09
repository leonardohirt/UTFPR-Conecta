import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { Login } from './features/login/login';
import { RegisterForm } from './features/register-form/register-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'event-form', component: EventForm },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterForm },
  { path: '**', redirectTo: 'home' }
];
