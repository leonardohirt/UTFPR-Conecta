import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    CommonModule,
    MainNavbar
  ],
  templateUrl: './home.html', 
  styleUrls: ['./home.css']   
})
export class HomeComponent {
}