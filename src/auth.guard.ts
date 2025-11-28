import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { from, map, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // 1. Se o signal currentUser já tem valor, usa ele
  const user = supabaseService.currentUser();

  if (user !== undefined) {
    if (user) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }

  // 2. Se ainda está carregando, usa getSession()
  return from(supabaseService.supabase.auth.getSession()).pipe(
    map(({ data: { session } }) => !!session),
    tap(isLoggedIn => {
      if (!isLoggedIn) router.navigate(['/login']);
    })
  );
};
