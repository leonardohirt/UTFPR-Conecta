import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { Footer } from "../../core/components/footer/footer";
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, Footer, MainNavbar],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

  pendentes: any[] = [];

  constructor(private supabase: SupabaseService) {
    this.loadPendingEvents();
  }

  async loadPendingEvents() {
    const { data, error } = await this.supabase.getPendingEvents();

    if (!error) {
      this.pendentes = data || [];
    }
  }

  async aprovar(id: number) {
    await this.supabase.approveEvent(id);
    this.loadPendingEvents();
  }

  async excluir(id: number) {
    await this.supabase.deleteEvent(id);
    this.loadPendingEvents();
  }
}
