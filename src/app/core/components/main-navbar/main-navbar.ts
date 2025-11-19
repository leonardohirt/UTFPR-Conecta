import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Inclui NgIf, NgFor, etc.

import { RegisterNavbar } from '../register-navbar/register-navbar';
import { SupabaseService } from '../../../../supabase.service'; // Ajuste o caminho conforme sua estrutura

@Component({
  selector: 'app-main-navbar',
  standalone: true, // Adicionado (se não estiver explícito no seu projeto, deve estar aqui)
  imports: [CommonModule, RegisterNavbar, RouterLink], // CommonModule substitui NgIf e NgFor
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css',
})
export class MainNavbar {

  // 1. Injeção de dependências
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  // 2. Expor o Signal de estado do usuário para o template (para *ngIf)
  public currentUser = this.supabaseService.currentUser;

  // Variável para controle do menu mobile/dropdown
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // 3. Lógica de Logout
  async handleLogout(): Promise<void> {
    const { error } = await this.supabaseService.logout();

    if (error) {
      console.error('Erro ao fazer logout:', error);
      // Adicione um modal ou notificação de erro aqui, se necessário
    } else {
      // Redireciona para a página de login após o sucesso
      this.router.navigate(['/login']);
    }
  }
}