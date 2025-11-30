import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private supabaseService: SupabaseService) {}

  // 🔹 Criar evento
  async createEvent(payload: any) {
    return await this.supabaseService.supabase
      .from('events')
      .insert(payload);
  }

  // 🔹 Listar todos os eventos
  async getAllEvents() {
    return await this.supabaseService.supabase
      .from('events')
      .select('*')
      .order('criado_em', { ascending: false });
  }

  // 🔹 Buscar evento por ID
  async getEventById(id: string) {
    return await this.supabaseService.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
  }

  // 🔹 Atualizar evento
  async updateEvent(id: string, payload: any) {
    return await this.supabaseService.supabase
      .from('events')
      .update(payload)
      .eq('id', id);
  }

  // 🔹 Excluir evento
  async deleteEvent(id: string) {
    return await this.supabaseService.supabase
      .from('events')
      .delete()
      .eq('id', id);
  }
}
