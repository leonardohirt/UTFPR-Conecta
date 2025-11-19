import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SupabaseService } from '../../../supabase.service'; // Ajuste o caminho se necessário
import { Button } from '../../shared/button/button';
import { RegisterNavbar } from '../../core/components/register-navbar/register-navbar';
import { MainNavbar } from "../../core/components/main-navbar/main-navbar";


@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule, Button, RegisterNavbar, MainNavbar, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  // Variáveis do Formulário
  name: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  
  // Controle de Estado
  showModal: boolean = false;
  modalMessage: string = '';
  idValue: string = "";
  isSubmitting: boolean = false; // Novo: Para desativar o botão enquanto carrega

  // 2. Injetar Router E SupabaseService
  constructor(
    private router: Router,
    private supabaseService: SupabaseService // Injeção do serviço
  ) {}

  // 3. Tornar a função de registro assíncrona
  async register(): Promise<void> {
    
    // --- Validações de Frontend ---
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
    // ----------------------------

    this.isSubmitting = true; // Inicia o estado de carregamento
    
    try {
      // 4. Chamar o método 'register' do serviço Supabase
      const { user, error } = await this.supabaseService.register(
        this.email,
        this.password,
        this.name
      );

      if (error) {
        // Lidar com erros de Supabase (ex: e-mail já existe, senha fraca)
        let message = 'Erro desconhecido ao cadastrar. Tente novamente.';
        if (error.message.includes('already registered')) {
           message = 'Este e-mail já está cadastrado. Por favor, faça login.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
           message = 'A senha deve ter pelo menos 6 caracteres.';
        }
        
        this.modalMessage = message;
        this.showModal = true;
        
      } else if (user) {
        // 5. Sucesso: Mensagem e Redirecionamento
        this.modalMessage = 
          `Cadastro realizado com sucesso!\nFaça login para continuar.`;
        this.showModal = true;
        // O redirecionamento será tratado no closeModal após o usuário clicar em "Ok".
      }

    } catch (e) {
      console.error('Erro inesperado durante o cadastro:', e);
      this.modalMessage = "Ocorreu um erro inesperado no sistema.";
      this.showModal = true;
    } finally {
      this.isSubmitting = false; // Finaliza o carregamento
    }
  }

  closeModal(): void {
    this.showModal = false;

    // 6. Redirecionar APENAS se o cadastro foi um sucesso
    if (this.modalMessage.startsWith("Cadastro realizado") || this.modalMessage.startsWith("Cadastro iniciado")) {
      this.router.navigate(['login']);
    }
  }
}