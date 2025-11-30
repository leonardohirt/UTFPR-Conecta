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

  async loadUserCourse() {
    const user = await this.supabaseService.getUser();
    if (!user) return;

    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('curso')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      this.userCourse = data.curso;
    }

    if (!this.userCourse) {
      this.router.navigate(['/selecionar-curso']);
    }
  }

  async loadEvents() {
    if (this.userCourse === null) return;

    if (this.userCourse !== 'Não tenho curso') {
      const rec = await this.supabaseService.getRecommendedEvents(this.userCourse);
      if (!rec.error) {
        this.recommendedEvents = rec.data?.map((e: any) => this.ensureBannerUrl(e)) || [];
      }
    } else {
      const general = await this.supabaseService.supabase
        .from('events')
        .select('*')
        .eq('curso_destinado', 'geral')
        .eq('aprovado', true);

      if (!general.error) {
        this.recommendedEvents = general.data?.map((e: any) => this.ensureBannerUrl(e)) || [];
      }
    }

    const feat = await this.supabaseService.getFeaturedEvents();
    if (!feat.error) {
      this.featuredEvents = feat.data?.map((e: any) => this.ensureBannerUrl(e)) || [];
    }

    const all = await this.supabaseService.getAllEvents();
    if (!all.error) {
      this.allEvents = all.data?.map((e: any) => this.ensureBannerUrl(e)) || [];
    }
  }

  private ensureBannerUrl(event: any) {
    if (!event.banner_url?.startsWith('http')) {
      event.banner_url = `https://ndivvhdlcbwbpukcguxo.supabase.co/storage/v1/object/public/event-banners/${event.banner_url}`;
    }
    return event;
  }
}
