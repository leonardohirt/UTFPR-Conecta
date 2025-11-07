import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { MainNavbar } from './core/components/main-navbar/main-navbar'; 
import { HomeComponent } from './features/home/home';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet, MainNavbar, HomeComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atividade08');
}