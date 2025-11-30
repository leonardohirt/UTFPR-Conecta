import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { MainNavbar } from '../../core/components/main-navbar/main-navbar';
import { Footer } from '../../core/components/footer/footer';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-event-crud',
  standalone: true,
  imports: [CommonModule, MainNavbar, Footer, Button],
  templateUrl: './event-crud.html',
})
export class EventCrud implements OnInit {
  
  events: any[] = [];
  loading = true;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;
    const { data, error } = await this.eventService.getAllEvents();
    if (!error) {
      this.events = data || [];
    }
    this.loading = false;
  }

  openCreatePage() {
    this.router.navigate(['/event-form']);
  }

  openEditPage(id: string) {
    this.router.navigate(['/event-form'], { queryParams: { id } });
  }
  

  async deleteEvent(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    const { error } = await this.eventService.deleteEvent(id);

    if (error) {
      alert('Erro ao deletar.');
      return;
    }

    this.events = this.events.filter(ev => ev.id !== id);
  }
}
