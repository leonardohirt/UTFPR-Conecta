import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../model/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.events = this.eventsService.getEvents();
  }
}
