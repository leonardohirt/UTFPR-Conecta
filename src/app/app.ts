import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; 
import { MainNavbar } from './core/components/main-navbar/main-navbar'; 
import { HomeComponent } from './features/home/home';
import { Button } from './shared/button/button';
import { RegisterForm } from "./features/register-form/register-form";
import { EventForm } from "./features/event-form/event-form";

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,
    RouterLink,
    MainNavbar,
    HomeComponent,
    Button,
    RegisterForm,
    EventForm,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], 
})
export class App {
  protected readonly title = signal('atividade08');
}
