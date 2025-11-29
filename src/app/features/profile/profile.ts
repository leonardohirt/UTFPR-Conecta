import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../../supabase.service';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MainNavbar, Footer],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  eventos: any[] = [];
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.user = this.supabase.currentUser();
    if (!this.user) {
      this.loading = false;
      return;
    }

    // busca eventos criados pelo usuário
    const { data, error } = await this.supabase.getEventById(this.user.id);

    if (!error && data) {
      this.eventos = data.map((e: any) => this.ensureBannerUrl(e)); // <--- AQUI FOI CORRIGIDO
    }

    this.loading = false;
  }

  private ensureBannerUrl(e: any) { // <-- tipado também
    if (e.banner_url && !e.banner_url.startsWith('http')) {
      e.banner_url = `https://ndivvhdlcbwbpukcguxo.supabase.co/storage/v1/object/public/event-banners/${e.banner_url}`;
    }
    return e;
  }

  async requestDelete(eventId: string) {
    const { error } = await this.supabase.requestEventDeletion(eventId, this.user.id);

    if (!error) {
      alert("Pedido de exclusão enviado para aprovação do admin!");
    } else {
      console.error(error);
      alert("Erro ao solicitar exclusão!");
    }
  }

}
