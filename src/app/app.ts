import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterForm } from './features/register-form/register-form';
import { RegisterNavbar } from './core/components/register-navbar/register-navbar';


@Component({
  selector: 'app-root',
  imports: [ RegisterForm, RouterOutlet, RegisterNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atividade08');
}
