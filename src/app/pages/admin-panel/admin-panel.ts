import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';
import { Footer } from "../../core/components/footer/footer";
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, Footer, MainNavbar],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css'],
})
export class AdminPanel implements OnInit {

  // Eventos pendentes de aprovação
  pendentes: any[] = [];

  // Solicitações de exclusão
  deletionRequests: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.loadPendingEvents();
    this.loadDeletionRequests();
  }

  // ======================================================
  // 🔹 CARREGA EVENTOS PENDENTES
  // ======================================================
  async loadPendingEvents() {
    const { data, error } = await this.supabase.getPendingEventsAdmin();
    if (!error) this.pendentes = data || [];
  }

  async aprovar(id: number) {
    await this.supabase.approveEvent(id);
    this.loadPendingEvents();
  }

  async excluir(id: number) {
    await this.supabase.deleteEvent(id);
    this.loadPendingEvents();
  }

  // ======================================================
  // 🔹 CARREGA SOLICITAÇÕES DE EXCLUSÃO
  // ======================================================
  async loadDeletionRequests() {
    const { data, error } = await this.supabase.getDeletionRequests();
    if (error || !data) return;

    const filled: any[] = [];

    for (const req of data) {
      const event = await this.supabase.getEventById(req.event_id);
      const user = await this.supabase.getUserProfile(req.user_id);

      filled.push({
        ...req,
        event: event.data,
        user: user.data
      });
    }

    this.deletionRequests = filled;
  }

  // ======================================================
  // 🔹 APROVAR PEDIDO DE EXCLUSÃO
  // ======================================================
  async approveDelete(requestId: string, eventId: string) {
    await this.supabase.approveDeletionRequest(requestId, eventId);
    this.loadDeletionRequests();
  }

  // ======================================================
  // 🔹 NEGAR PEDIDO DE EXCLUSÃO
  // ======================================================
  async rejectDelete(requestId: string) {
    await this.supabase.rejectDeletionRequest(requestId);
    this.loadDeletionRequests();
  }

}
