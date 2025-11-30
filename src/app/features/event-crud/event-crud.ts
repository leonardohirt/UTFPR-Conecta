import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service'; // Assumindo que este serviço encapsula SupabaseService
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';
import { Button } from '../../shared/button/button';
import { SupabaseService } from '../../../supabase.service'; // Importar SupabaseService

@Component({
  selector: 'app-event-crud',
  standalone: true,
  imports: [CommonModule, MainNavbar, Footer, Button],
  templateUrl: './event-crud.html',
})
export class EventCrud implements OnInit {
  
  events: any[] = [];
  loading = true;
  currentUserId: string | null = null; // Para armazenar o ID do usuário

  // --- Modal ---
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalMessage: string = '';
  eventToDeleteId: string | null = null; // ID do evento para exclusão

  constructor(
    private eventService: EventService,
    private router: Router,
    private supabaseService: SupabaseService // Injetar SupabaseService
  ) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    this.currentUserId = user?.id ?? null;
    await this.loadEvents();
  }

  async loadEvents() {
    if (!this.currentUserId) {
      this.loading = false;
      this.openModal('error', 'Usuário não autenticado.');
      return;
    }

    this.loading = true;
    // Chama a nova função para carregar eventos criados pelo usuário logado
    const { data, error } = await this.supabaseService.getEventsByCreator(this.currentUserId);
    
    if (!error) {
      this.events = data || [];
    } else {
      console.error('Erro ao carregar eventos:', error);
      this.openModal('error', 'Erro ao carregar eventos.');
    }
    this.loading = false;
  }

  openCreatePage() {
    this.router.navigate(['/event-form']);
  }

  openEditPage(id: string) {
    // Apenas navegamos, o formulário de edição fará a verificação
    this.router.navigate(['/event-form'], { queryParams: { id } });
  }

  // 1. Prepara para exclusão (Abre modal de confirmação)
  confirmDelete(id: string) {
    this.eventToDeleteId = id;
    this.openModal('error', 'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.', true);
  }
  
  // 2. Executa a exclusão (Chamado pelo botão no modal)
  async deleteEvent() {
    if (!this.eventToDeleteId) return;

    this.closeModal(); // Fecha o modal de confirmação

    const id = this.eventToDeleteId;
    this.loading = true; // Mostra o loader enquanto exclui

    const { error } = await this.supabaseService.deleteEvent(id);

    if (error) {
      this.openModal('error', 'Erro ao deletar o evento: ' + error.message);
    } else {
      this.events = this.events.filter(ev => ev.id !== id);
      this.openModal('success', 'Evento excluído com sucesso!');
    }

    this.loading = false;
    this.eventToDeleteId = null;
  }

  // --- Métodos do Modal ---
  openModal(type: 'success' | 'error', message: string, isConfirmation = false) {
    this.modalType = type;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.eventToDeleteId = null; // Reseta o ID após fechar
  }
}