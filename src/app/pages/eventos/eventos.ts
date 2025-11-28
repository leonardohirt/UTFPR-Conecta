import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, MainNavbar, Footer, RouterModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css']
})
export class EventosComponent implements OnInit {

  eventos: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabaseService.getAllEvents();
    if (!error && data) {
      // garante que a URL do banner esteja completa
      this.eventos = data.map(e => this.ensureBannerUrl(e));
    }
  }

  private ensureBannerUrl(e: any) {
    if (e.banner_url && !e.banner_url.startsWith('http')) {
      e.banner_url = `https://ndivvhdlcbwbpukcguxo.supabase.co/storage/v1/object/public/event-banners/${e.banner_url}`;
    }
    return e;
  }

}
