import { Component } from '@angular/core';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [RegisterNavbar, FormsModule, RouterLink, Button], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'], 
})
export class Login {

  email: string = '';
  password: string ='';

  login( ){

  }
  
}
