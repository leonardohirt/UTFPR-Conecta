import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { Button } from '../../shared/button/button';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegisterNavbar, FormsModule, RouterLink, Button, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  email: string = '';
  password: string = '';

  showModal: boolean = false;
  modalMessage: string = '';
  loginSuccess: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async login(): Promise<void> {

    if (!this.email || !this.password) {
      this.modalMessage = "Por favor, preencha o e-mail e a senha.";
      this.showModal = true;
      return;
    }

    this.isSubmitting = true;
    this.loginSuccess = false;

    try {
      const { user, error } = await this.supabaseService.login(
        this.email,
        this.password
      );

      if (error || !user) {

        let message = "Credenciais de login inválidas.";

        if (error && !error.message.includes("Invalid login credentials")) {
          message = "Erro ao tentar fazer login. Tente novamente.";
          console.error("Erro no login:", error);
        }

        this.modalMessage = message;
        this.showModal = true;
        this.loginSuccess = false;

      } else {
        this.modalMessage = "Login realizado com sucesso! Redirecionando...";
        this.showModal = true;
        this.loginSuccess = true;
      }

    } catch (e) {
      console.error('Erro inesperado durante o login:', e);
      this.modalMessage = "Ocorreu um erro inesperado no sistema.";
      this.showModal = true;
      this.loginSuccess = false;

    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal(): void {
    this.showModal = false;

    if (this.loginSuccess) {
      this.router.navigate(['/home']);
    }
  }
}
