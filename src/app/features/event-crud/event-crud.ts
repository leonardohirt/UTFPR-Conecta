import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service'; 
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';
import { Button } from '../../shared/button/button';
import { SupabaseService } from '../../../supabase.service'; 

@Component({
  selector: 'app-event-crud',
  standalone: true,
  imports: [CommonModule, MainNavbar, Footer, Button],
  templateUrl: './event-crud.html',
})
export class EventCrud implements OnInit {
  
  events: any[] = [];
  loading = true;
  currentUserId: string | null = null; 

  // --- Modal ---
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalMessage: string = '';
  eventToDeleteId: string | null = null; 

  constructor(
    private eventService: EventService,
    private router: Router,
    private supabaseService: SupabaseService 
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
    this.router.navigate(['/event-form'], { queryParams: { id } });
  }

  // 1. Prepara para exclusão (Abre modal de confirmação)
  confirmDelete(id: string) {
    this.eventToDeleteId = id;
    // Mudança para 'success' para não mostrar um X de erro na confirmação
    this.openModal('success', 'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.', true);
  }
  
  // 2. Executa a exclusão (Chamado pelo botão no modal)
  async deleteEvent() {
    // CORREÇÃO PRINCIPAL: Isola o ID do evento imediatamente
    const idToDelete = this.eventToDeleteId;

    if (!idToDelete) {
        // Se o ID for nulo (apenas uma medida de segurança)
        this.openModal('error', 'Erro interno: ID do evento para exclusão não foi capturado.');
        return;
    }

    this.closeModal(); // Fecha o modal de confirmação
    this.loading = true; // Mostra o loader enquanto exclui

    // Usa o ID isolado
    const { error } = await this.supabaseService.deleteEvent(idToDelete);

    if (error) {
      this.openModal('error', 'Erro ao deletar o evento: ' + error.message);
    } else {
      this.events = this.events.filter(ev => ev.id !== idToDelete);
      this.openModal('success', 'Evento excluído com sucesso!');
    }

    this.loading = false;
    this.eventToDeleteId = null; // CORREÇÃO: Limpa o ID APENAS após a conclusão da operação
  }

  // --- Métodos do Modal ---
  openModal(type: 'success' | 'error', message: string, isConfirmation = false) {
    this.modalType = type;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    // CORREÇÃO: Comentamos ou removemos a limpeza prematura daqui
    // O this.eventToDeleteId = null; foi movido para o final de deleteEvent()
  }
}