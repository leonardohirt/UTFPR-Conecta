import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterForm } from './features/register-form/register-form';
import { RegisterNavbar } from './core/components/register-navbar/register-navbar';
import { Login } from "./features/login/login";
import { MainNavbar } from './core/components/main-navbar/main-navbar';


@Component({
  selector: 'app-root',
  imports: [RegisterForm, RouterOutlet, RegisterNavbar, Login, MainNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atividade08');
}
