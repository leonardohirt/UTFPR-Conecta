import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterForm } from './features/register-form/register-form';
import { RegisterNavbar } from './core/components/register-navbar/register-navbar';
import { Login } from "./features/login/login";


@Component({
  selector: 'app-root',
  imports: [RegisterForm, RouterOutlet, RegisterNavbar, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atividade08');
}
