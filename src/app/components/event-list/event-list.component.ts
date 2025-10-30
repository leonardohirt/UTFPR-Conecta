import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../services/events-services';
import { Event } from '../../../model/event.model';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [CommonModule, EventCardComponent],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.events = this.eventsService.getEvents();
  }
}
