import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [
    { id: 1, title: 'Semana Acadêmica', description: 'Eventos de tecnologia e cultura', date: '2025-11-05', location: 'Auditório Principal' },
    { id: 2, title: 'Palestra sobre IA', description: 'Palestra com especialistas em IA', date: '2025-11-12', location: 'Laboratório de Computação' }
  ];

  getEvents(): Event[] {
    return this.events;
  }

  getEventById(id: number): Event | undefined {
    return this.events.find(e => e.id === id);
  }

  addEvent(event: Event) {
    this.events.push(event);
  }
}
