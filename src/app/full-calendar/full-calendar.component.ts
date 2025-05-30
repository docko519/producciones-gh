import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../auth/auth.service';
import { CalendarService } from '../services/calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements AfterViewInit, OnDestroy {
  private calendar!: Calendar;
  private calendarSub!: Subscription;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    events: [],
    eventDisplay: 'background',
    eventColor: '#378006',
    eventTextColor: '#ffffff'
  };

  constructor(
    private authService: AuthService,
    private calendarService: CalendarService
  ) {}

  ngAfterViewInit(): void {
    this.initCalendar();
    this.loadCalendarEvents();

    this.calendarSub = this.calendarService.updateCalendar$.subscribe(() => {
      this.loadCalendarEvents();
    });
  }

  ngOnDestroy(): void {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  private initCalendar(): void {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      this.calendar = new Calendar(calendarEl, this.calendarOptions);
      this.calendar.render();
    }
  }
  private loadCalendarEvents(): void {
    this.authService.getEventosCalendario().subscribe({
      next: (eventos: any) => {
        this.calendar.removeAllEvents();
        this.calendar.addEventSource(eventos); // 👈 usa directamente
      },
      error: (err) => console.error('Error cargando eventos:', err)
    });
  }
  
  
  private getEventColor(estado: string): string {
    switch (estado) {
      case 'disponible': return '#378006';
      case 'pendiente': return '#FFA500';
      case 'no-disponible': return '#FF0000';
      default: return '#cccccc';
    }
  }
  

  handleDateClick(arg: any): void {
    const fechaSeleccionada = arg.dateStr;
    this.calendarService.notifyDateSelected(fechaSeleccionada);
  }
}
