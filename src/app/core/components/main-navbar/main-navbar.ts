import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RegisterNavbar } from '../register-navbar/register-navbar';
import { SupabaseService } from '../../../../supabase.service';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [CommonModule, RegisterNavbar, RouterLink],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css',
})
export class MainNavbar {

  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  // sinal do usuário atual
  public currentUser = this.supabaseService.currentUser;

  // sinal para saber se o usuário é admin
  public isAdminSignal = signal(false);

  menuOpen = false;

  constructor() {
    // toda vez que o currentUser mudar, checa se é admin
    effect(async () => {
      const user = this.currentUser();
      if (user) {
        const admin = await this.supabaseService.isAdmin(user.id);
        this.isAdminSignal.set(admin);
      } else {
        this.isAdminSignal.set(false);
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Função só para simplificar o *ngIf
  isAdmin(): boolean {
    return this.isAdminSignal();
  }

  async handleLogout(): Promise<void> {
    const { error } = await this.supabaseService.logout();

    if (error) {
      console.error('Erro ao fazer logout:', error);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
