import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private supabase = createClient('URL', 'ANON_KEY');

  // 📌 Upload do banner
  async uploadBanner(file: File) {
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await this.supabase.storage
      .from('event-banners')
      .upload(fileName, file);

    if (error) return { error, url: null };

    // Pega URL pública
    const { data: publicUrl } = this.supabase.storage
      .from('event-banners')
      .getPublicUrl(fileName);

    return { error: null, url: publicUrl.publicUrl };
  }

  // 📌 Salvar evento no database
  async saveEvent(eventData: any) {
    const { error } = await this.supabase
      .from('events')
      .insert(eventData);

    return { error };
  }
}
