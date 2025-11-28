import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../../../supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {

    // pega o usuário usando o MÉTODO DO SEU SERVIÇO
    const user = await this.supabase.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // verifica no banco se o usuário é admin
    const isAdmin = await this.supabase.isAdmin(user.id);

    if (isAdmin) {
      return true;
    }

    // se não for admin → redireciona
    this.router.navigate(['/home']);
    return false;
  }

  
}
