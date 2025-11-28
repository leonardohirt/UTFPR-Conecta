import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: any = null;

  constructor(private supabaseService: SupabaseService) {
    this.loadUser();
  }

  async loadUser() {
    const { data, error } = await this.supabaseService.supabase.auth.getUser();

    if (error) {
      console.error('Erro ao carregar usuário:', error);
      this.user = null;
      return;
    }

    this.user = data.user;
  }

  getUser() {
    return this.user;
  }

  isAdmin(): boolean {
    return this.user?.user_metadata?.is_admin === true;
  }
}
