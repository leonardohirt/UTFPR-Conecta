import { Component, Input } from '@angular/core';
import { Event } from '../../model/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html'
})
export class EventCardComponent {
  @Input() event!: Event;
}
