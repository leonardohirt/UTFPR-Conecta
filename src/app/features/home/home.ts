import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';
import { SupabaseService } from '../../../supabase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MainNavbar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  recommendedEvents: any[] = [];
  featuredEvents: any[] = [];
  allEvents: any[] = [];
  userCourse: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadUserCourse();
    await this.loadEvents();
  }

  // 🔥 Busca o curso do usuário logado
  async loadUserCourse() {
    const user = this.supabaseService.currentUser();

    if (!user) return;

    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('curso')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      this.userCourse = data.curso;
    }

    // ⚠️ Se o usuário ainda não escolheu um curso → manda para página de seleção
    if (!this.userCourse) {
      this.router.navigate(['/selecionar-curso']);
    }
  }

  async loadEvents() {
    // Se o curso ainda não estiver carregado, não prossegue
    if (this.userCourse === null) return;

    // 🎯 Caso 1 — Usuário tem curso normal
    if (this.userCourse !== 'Não tenho curso') {
      const rec = await this.supabaseService.getRecommendedEvents(this.userCourse);

      if (!rec.error) {
        this.recommendedEvents = rec.data?.map(e => this.ensureBannerUrl(e)) || [];
      }
    } 
    // 🎯 Caso 2 — Usuário marcou "Não tenho curso"
    else {
      const rec = await this.supabaseService.supabase
        .from('events')
        .select('*')
        .eq('curso_destinado', 'geral'); // ou null, depende do seu banco

      if (!rec.error) {
        this.recommendedEvents = rec.data?.map(e => this.ensureBannerUrl(e)) || [];
      }
    }

    // ⭐ Eventos em destaque
    const feat = await this.supabaseService.getFeaturedEvents();
    if (!feat.error) {
      this.featuredEvents = feat.data?.map(e => this.ensureBannerUrl(e)) || [];
    }

    // 📌 Todos os eventos
    const all = await this.supabaseService.getAllEvents();
    if (!all.error) {
      this.allEvents = all.data?.map(e => this.ensureBannerUrl(e)) || [];
    }
  }


  private ensureBannerUrl(event: any) {
    if (!event.banner_url?.startsWith('http')) {
      event.banner_url = `https://ndivvhdlcbwbpukcguxo.supabase.co/storage/v1/object/public/event-banners/${event.banner_url}`;
    }
    return event;
  }
}
