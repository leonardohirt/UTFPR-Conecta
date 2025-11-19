import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from './supabase.service'; // Ajuste o caminho se necessário
import { map, take, tap, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

/**
 * Auth Guard para verificar se o usuário está logado.
 * * Se o usuário estiver logado (currentUser for truthy), permite o acesso.
 * Caso contrário, redireciona para a página de login.
 * * NOTA: Como 'currentUser' no SupabaseService usa 'signal', 
 * fazemos uma checagem direta após a inicialização.
 */
export const AuthGuard: CanActivateFn = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // O Signal currentUser contém: 
  // - undefined: Carregando
  // - null: Deslogado
  // - User: Logado

  // O Guard deve esperar até que o estado seja definido (não seja 'undefined')
  // No Angular com Signals, a forma mais reativa é usar um truque de switchMap
  // para garantir que o estado inicial seja resolvido.
  // Entretanto, para simplicidade e compatibilidade com o ambiente, 
  // faremos uma verificação simples no estado resolvido.
  
  const user = supabaseService.currentUser();
  
  if (user !== undefined) {
    // Estado já resolvido (Logado ou Deslogado)
    if (user) {
      // Usuário está logado
      return true;
    } else {
      // Usuário não está logado, redireciona para a tela de login
      return router.createUrlTree(['/login']);
    }
  }

  // Se o estado ainda for 'undefined', o app provavelmente está carregando.
  // Para fins práticos em um projeto real, você usaria um Observable ou 
  // esperaria pelo carregamento em um componente Root.
  // Aqui, vamos redirecionar por segurança se o estado não for resolvido rapidamente.
  
  // No ambiente de produção, esta lógica seria ligeiramente diferente para 
  // aguardar o estado do Supabase (onAuthStateChange/getSession).
  
  // Para garantir que o Guard espere pelo Supabase, usaremos a promessa getSession
  return from(supabaseService.supabase.auth.getSession()).pipe(
    map(({ data: { session } }) => !!session), // Se houver sessão, retorna true
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        // Redireciona se não houver sessão
        router.navigate(['/login']);
      }
    })
  );
};