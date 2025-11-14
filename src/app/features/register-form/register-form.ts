import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';
import { MainNavbar } from "../../core/components/main-navbar/main-navbar";
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule, Button, RegisterNavbar, MainNavbar, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  name: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  idValue: string = "";

  
   constructor(private router: Router) {}

  register(): void {
    if (!this.password || this.password !== this.passwordConfirm) {
      this.modalMessage = " As senhas não coincidem ou estão vazias"
      this.showModal = true;
      return;
    }
    else{
      this.modalMessage = 
      `Cadastro realizado com sucesso!\n Nome: ${this.name} \n Email: ${this.email}`;
      this.showModal = true;

    }
   
  }

  closeModal(): void{
    this.showModal = false;

     if (this.modalMessage.startsWith("Cadastro realizado")) {
      this.router.navigate(['login']);
    }
  }
}
