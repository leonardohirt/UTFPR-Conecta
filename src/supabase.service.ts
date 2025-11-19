import { Injectable, signal} from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config'; 
import { User } from '@supabase/supabase-js'; 

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;
  public currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );

    // Monitoramento do estado de autenticação (essencial para o Auth Guard)
    this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUser.set(session?.user ?? null);
        console.log(`[Supabase Auth] Evento: ${event}`);
    });

    this.checkInitialSession();
  }

  private async checkInitialSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.set(session?.user ?? null);
  }

  // --- Funções de Autenticação (Auth) ---

  /**
   * Registra um novo usuário no Auth e salva o nome na tabela 'profiles'.
   */
  async register(email: string, password: string, name: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({ email, password });
    
    if (authError) {
      return { user: null, error: authError };
    }
    
    // Inserção na tabela 'profiles' (dados adicionais)
    if (authData.user) {
        const { error: profileError } = await this.supabase
          .from('profiles')
          .insert({ id: authData.user.id, name: name });
        if (profileError) {
          console.error('Erro ao salvar o perfil:', profileError);
          return { user: authData.user, error: profileError };
        }
    }
    
    return { user: authData.user, error: null };
  }

  /**
   * Faz login do usuário com e-mail e senha.
   */
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        return { user: null, error }; 
    }
    if (!data || !data.user) {
        return { user: null, error: { message: 'Invalid login credentials' } };
    }
    return { user: data.user, error: null };
  }
  
  /**
   * Sai da sessão do usuário.
   */
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }
  
  // --- Funções de Evento (Storage e DB) ---
  
  /**
   * Faz upload do arquivo de banner para o Supabase Storage.
   */
  async uploadBanner(file: File) {
    if (!file) return { url: null, error: { message: "Nenhum arquivo para upload." } };

    const fileName = `${Date.now()}_${file.name}`;

    // UPLOAD para o bucket 'event-banners'
    const { error: uploadError } = await this.supabase.storage
      .from('event-banners')
      .upload(fileName, file);

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    // OBTER URL PÚBLICA 
    const { data: urlData } = this.supabase.storage
      .from('event-banners')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  }

  /**
   * Insere o evento no banco de dados, injetando o user_id logado.
   */
  async insertEvent(eventData: any, bannerUrl: string) {
    // Obter o user_id logado (CRUCIAL para RLS)
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
        return { error: { message: "Nenhum usuário logado. Ação não permitida." } };
    }

    // Montar o objeto final, mapeando os campos para o BD e injetando o user_id
    const eventToInsert = {
        // Campos Básicos
        nome: eventData.nome,
        descricao: eventData.descricao,
        banner_url: bannerUrl,
        
        // Data e Hora
        data: eventData.data,
        hora_inicio: eventData.horaInicio, // CORRIGIDO: de hora_nicio para hora_inicio
        hora_fim: eventData.horaFim,
        
        // Localização (Usando campos individuais da API de CEP)
        cep: eventData.cep,
        rua: eventData.endereco.rua,
        bairro: eventData.endereco.bairro,
        cidade: eventData.endereco.cidade,
        estado: eventData.endereco.estado,
        
        // Categorias e Tipos
        categoria: eventData.categoria, 
        formato: eventData.formato,     
        tipo_inscricao: eventData.tipoInscricao, // Mapeado para tipo_inscricao
        
        // Vagas e Certificado
        limite_vagas: eventData.limiteVagas, // Mapeado para limite_vagas
        emite_certificado: eventData.emiteCertificado, // Mapeado para emite_certificado (bool)
    };

    // Inserir no Supabase (tabela 'events')
    const { error } = await this.supabase
      .from('events')
      .insert(eventToInsert); 
    
    return { error };
  }
}