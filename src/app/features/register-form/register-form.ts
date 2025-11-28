import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SupabaseService } from '../../../supabase.service';
import { Button } from '../../shared/button/button';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';
import { MainNavbar } from "../../core/components/main-navbar/main-navbar";
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    Button,
    RegisterNavbar,
    MainNavbar,
    RouterLink,
    Footer
  ],
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
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async register(): Promise<void> {

    if (!this.name || !this.email || !this.password || !this.passwordConfirm) {
      this.modalMessage = "Por favor, preencha todos os campos.";
      this.showModal = true;
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.modalMessage = "As senhas não coincidem!";
      this.showModal = true;
      return;
    }

    this.isSubmitting = true;

    try {
      const { user, error } = await this.supabaseService.register(
        this.email,
        this.password,
        this.name
      );

      if (error) {
        let message = 'Erro desconhecido ao cadastrar. Tente novamente.';

        if (error.message.includes('already registered')) {
          message = 'Este e-mail já está cadastrado. Por favor, faça login.';
        } 
        else if (error.message.includes('Password should be at least 6 characters')) {
          message = 'A senha deve ter pelo menos 6 caracteres.';
        }

        this.modalMessage = message;
        this.showModal = true;
      }

      else if (user) {
        this.modalMessage =
          `Cadastro realizado com sucesso!\nAgora selecione seu curso.`;
        this.showModal = true;
      }

    } catch (e) {
      console.error('Erro inesperado durante o cadastro:', e);
      this.modalMessage = "Ocorreu um erro inesperado no sistema.";
      this.showModal = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal(): void {
    this.showModal = false;

    // Agora redireciona para select-course
    if (this.modalMessage.startsWith("Cadastro realizado")) {
      this.router.navigate(['/select-course']);
    }
  }
}
