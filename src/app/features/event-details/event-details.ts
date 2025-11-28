import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MainNavbar, Footer],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.css']
})
export class EventDetailsComponent implements OnInit {

  event: any = null;
  user: any = null;
  isSubscribed: boolean = false;
  loadingSubscription = false;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // PEGA O VALOR REAL DO SIGNAL COM .()
    this.user = this.supabaseService.currentUser();

    // pega evento
    const { data, error } = await this.supabaseService.getEventById(id);
    if (!error && data) {
      this.event = this.ensureBannerUrl(data);
    }

    // verifica inscrição
    if (this.user) {
      this.isSubscribed = await this.supabaseService.isUserSubscribed(id, this.user.id);
    }
  }

  private ensureBannerUrl(e: any) {
    if (e.banner_url && !e.banner_url.startsWith('http')) {
      e.banner_url = `https://ndivvhdlcbwbpukcguxo.supabase.co/storage/v1/object/public/event-banners/${e.banner_url}`;
    }
    return e;
  }

  async subscribe() {
    if (!this.user || !this.event) return;

    this.loadingSubscription = true;

    try {
      // Chama a API de inscrição
      const { error } = await this.supabaseService.subscribeToEvent(
        this.event.id,
        this.user.id
      );

      if (!error) {
        // Marca localmente como inscrito
        this.isSubscribed = true;
      } else {
        console.error('Erro ao se inscrever:', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingSubscription = false;
    }
  }
}
