import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendario',
  template: `
    <app-full-calendar></app-full-calendar>
  `,
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnDestroy {
  private dateSub!: Subscription;

  constructor(
    private router: Router,
    private calendarService: CalendarService
  ) {
    // Escuchar selección de fechas
    this.dateSub = this.calendarService.dateSelected$.subscribe(date => {
      this.router.navigate(['/reserva', date]);
    });
  }

  ngOnDestroy(): void {
    if (this.dateSub) {
      this.dateSub.unsubscribe();
    }
  }
}