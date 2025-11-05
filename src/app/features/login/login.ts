import { Component } from '@angular/core';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [RegisterNavbar, FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
})
export class Login {

  email: string = '';
  password: string ='';

  login( ){

  }
  
}
