import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabase: SupabaseClient;
  public currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

    // Atualiza o signal quando o usuário loga/desloga
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });

    this.checkInitialSession();
  }

  private async checkInitialSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.set(session?.user ?? null);
  }

  // ========================================
  // 🔥 MÉTODO DE USUÁRIO — getUser()
  // ========================================
  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("Erro ao obter usuário:", error);
      return null;
    }
    return data.user ?? null;
  }

  // MÉTODO OPCIONAL — obter Session
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) return null;
    return data.session;
  }

  // ========================================
  // AUTH
  // ========================================
  async register(email: string, password: string, name: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email, password
    });
    if (authError) return { user: null, error: authError };

    if (authData.user) {
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          curso: null,
          is_admin: false
        });

      if (profileError) return { user: authData.user, error: profileError };
    }

    return { user: authData.user, error: null };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email, password
    });
    return { user: data?.user || null, error };
  }

  async logout() {
    return await this.supabase.auth.signOut();
  }

  // ========================================
  // PROFILE
  // ========================================
  async getUserProfile(userId: string) {
    return await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  }

  async updateUserCourse(userId: string, course: string) {
    const { error } = await this.supabase
      .from('profiles')
      .update({ curso: course })
      .eq('id', userId);

    return { error };
  }

async getUserCourse() {
  const user = this.currentUser();
  if (!user) return null;

  const { data, error } = await this.supabase
    .from('profiles')
    .select('curso')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Erro ao buscar curso:", error);
    return null;
  }

  return data?.curso ?? null;
}


  // ========================================
  // ADMIN — (ÚNICO MÉTODO CORRETO)
  // ========================================
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }

    return data?.is_admin === true;
  }

  async setAdmin(userId: string, isAdmin = true) {
    const { error } = await this.supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    return { error };
  }


  async uploadBanner(file: File) {
    if (!file) return { url: null, error: { message: 'Nenhum arquivo selecionado' } };

    const fileName = `${Date.now()}_${file.name}`;
    const bucket = 'event-banners';

    const { error: uploadError } = await this.supabase
      .storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) return { url: null, error: uploadError };

    const { data: urlData } = this.supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  }

  // ========================================
  // EVENTS
  // ========================================
  async insertEvent(eventData: any, bannerUrl: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { error: { message: 'Usuário não logado' } };

    const eventToInsert = {
      nome: eventData.nome,
      descricao: eventData.descricao,
      banner_url: bannerUrl || null,
      data: eventData.data,
      hora_inicio: eventData.horaInicio,
      hora_fim: eventData.horaFim,
      cep: eventData.cep,
      rua: eventData.endereco?.rua,
      bairro: eventData.endereco?.bairro,
      cidade: eventData.endereco?.cidade,
      estado: eventData.endereco?.estado,
      categoria: eventData.categoria,
      formato: eventData.formato,
      tipo_inscricao: eventData.tipoInscricao,
      limite_vagas: eventData.limiteVagas,
      emite_certificado: eventData.emiteCertificado,
      criado_por: user.id,
      criado_em: new Date(),
      curso_destinado: eventData.categoria || null,
      aprovado: false
    };

    const { error } = await this.supabase
      .from('events')
      .insert(eventToInsert);

    return { error };
  }

  async getAllEvents() {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('aprovado', true)
      .order('data', { ascending: true });

    return { data, error };
  }

  async getRecommendedEvents(category: string) {
    if (!category || category === 'Não tenho curso') {
      return this.getFeaturedEvents();
    }

    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('curso_destinado', category)
      .eq('aprovado', true)
      .limit(3);

    return { data, error };
  }

  async getFeaturedEvents() {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('aprovado', true)
      .order('criado_em', { ascending: false })
      .limit(3);

    return { data, error };
  }

  // ========================================
  // ADMIN (EVENTS)
  // ========================================
  async getPendingEvents() {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('aprovado', false);

    return { data, error };
  }

  async approveEvent(id: number) {
    const { data, error } = await this.supabase
      .from('events')
      .update({ aprovado: true })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteEvent(id: number) {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', id);

    return { error };
  }

  // ========================================
  // EVENT DETAILS
  // ========================================
  async getEventById(id: string) {
    return this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
  }

  // ========================================
  // INSCRIÇÕES
  // ========================================
  async isUserSubscribed(eventId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return false;
    return data !== null;
  }

  async subscribeToEvent(eventId: string, userId: string) {
    return await this.supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: userId });
  }

}
