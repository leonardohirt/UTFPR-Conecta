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
  // AUTHENTICATION
  // ========================================
  async register(email: string, password: string, name: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({ email, password });
    if (authError) return { user: null, error: authError };

    if (authData.user) {
      await this.supabase.from('profiles').insert({
        id: authData.user.id,
        name,
        curso: null,
        is_admin: false
      });
    }

    return { user: authData.user, error: null };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    return { user: data?.user || null, error };
  }

  async logout() {
    return await this.supabase.auth.signOut();
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("Erro ao obter usuário:", error);
      return null;
    }
    return data.user ?? null;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    return error ? null : data.session;
  }

  // ========================================
  // PROFILE
  // ========================================
  async getUserProfile(userId: string) {
    return await this.supabase.from('profiles').select('*').eq('id', userId).single();
  }

  async updateUserCourse(userId: string, course: string) {
    return await this.supabase.from('profiles').update({ curso: course }).eq('id', userId);
  }

  async getUserCourse() {
    const user = this.currentUser();
    if (!user) return null;

    const { data } = await this.supabase.from('profiles').select('curso').eq('id', user.id).single();
    return data?.curso ?? null;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const { data } = await this.supabase.from('profiles').select('is_admin').eq('id', userId).single();
    return data?.is_admin === true;
  }

  async setAdmin(userId: string, isAdmin = true) {
    return await this.supabase.from('profiles').update({ is_admin: isAdmin }).eq('id', userId);
  }

  // ========================================
  // BANNER UPLOAD
  // ========================================
  async uploadBanner(file: File) {
    if (!file) return { url: null, error: { message: 'Nenhum arquivo selecionado' } };

    const fileName = `${Date.now()}_${file.name}`;
    const bucket = 'event-banners';

    const { error: uploadError } = await this.supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) return { url: null, error: uploadError };

    const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(fileName);
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
      emite_certificado: eventData.emiteCertificado, // Recebe booleano do event-form.ts
      criado_por: user.id,
      criado_em: new Date(),
      curso_destinado: eventData.curso_destinado ?? null,
      aprovado: false,
    };

    return await this.supabase.from('events').insert(eventToInsert);
  }

  async getAllEvents() {
    return await this.supabase.from('events').select('*').eq('aprovado', true).order('data', { ascending: true });
  }

  async getEventById(id: string) {
    return await this.supabase.from('events').select('*').eq('id', id).single();
  }

  async updateEventById(id: number | string, payload: any) {
    // O payload deve ser criado no event-form.ts usando os nomes de coluna do Supabase (snake_case)
    return await this.supabase.from('events').update(payload).eq('id', id).select().single();
  }

  async getEventsByCreator(userId: string) {
    return await this.supabase.from('events').select('*').eq('criado_por', userId).order('criado_em', { ascending: false });
  }

  async getPendingEventsAdmin() {
    return await this.supabase.from('events').select('*').eq('aprovado', false).order('criado_em', { ascending: true });
  }

  async approveEvent(id: number) {
    return await this.supabase.from('events').update({ aprovado: true }).eq('id', id).select().single();
  }

  async deleteEvent(id: number) {
    return await this.supabase.from('events').delete().eq('id', id);
  }

  // ========================================
  // RECOMMENDED & FEATURED EVENTS
  // ========================================
  async getRecommendedEvents(curso: string) {
    return await this.supabase.from('events').select('*').eq('curso_destinado', curso).eq('aprovado', true);
  }

  async getFeaturedEvents() {
    return await this.supabase.from('events').select('*').eq('destaque', true).eq('aprovado', true);
  }

  // ========================================
  // EVENT REGISTRATION
  // ========================================
  async isUserSubscribed(eventId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    return !error && data !== null;
  }

  async subscribeToEvent(eventId: string, userId: string) {
    return await this.supabase.from('event_registrations').insert({ event_id: eventId, user_id: userId });
  }

  // ========================================
  // EVENT DELETION REQUESTS
  // ========================================
  async requestEventDeletion(eventId: string, userId: string) {
    return await this.supabase.from('event_delete_requests').insert({
      event_id: eventId,
      user_id: userId,
      status: 'pending',
      created_at: new Date().toISOString()
    });
  }

  async getDeletionRequests() {
    return await this.supabase.from('event_delete_requests').select('*').order('created_at', { ascending: false });
  }

  async approveDeletionRequest(requestId: string, eventId: string) {
    const { error: deleteError } = await this.supabase.from('events').delete().eq('id', eventId);
    if (deleteError) return { error: deleteError };

    const { error: updateError } = await this.supabase.from('event_delete_requests').update({ status: 'approved' }).eq('id', requestId);
    return { error: updateError };
  }

  async rejectDeletionRequest(requestId: string) {
    return await this.supabase.from('event_delete_requests').update({ status: 'rejected' }).eq('id', requestId);
  }
}