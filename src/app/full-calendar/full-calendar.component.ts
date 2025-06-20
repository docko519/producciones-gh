import { Component, AfterViewInit } from '@angular/core';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements AfterViewInit {
  private calendar!: Calendar;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    events: [],
    eventDisplay: 'background',
    eventDidMount: this.handleEventRender.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    dayMaxEvents: true,
    selectable: true,
    timeZone: 'local',
    dayCellClassNames: 'fc-day-cell',
    eventClassNames: 'fc-custom-event'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.initCalendar();
    this.loadCalendarEvents();
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
        this.calendar.addEventSource(eventos);
        
        // Forzar actualización visual
        setTimeout(() => {
          this.calendar.render();
          document.querySelectorAll('.fc-event').forEach(el => {
            el.classList.add('fc-event-loaded');
          });
        }, 50);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  private handleEventRender(info: any): void {
    // Añadir clases según el estado
    info.el.classList.add(`fc-event-${info.event.extendedProps.estado}`);
    
    // Deshabilitar interacción en eventos de fondo
    if (info.event.display === 'background') {
      info.el.style.pointerEvents = 'none';
    }
  }

  private handleDateClick(info: any): void {
    const eventos = this.calendar.getEvents();
    const eventosEnFecha = eventos.filter(e => 
      e.start && new Date(e.start).toISOString().slice(0, 10) === info.dateStr
    );

    const puedeReservar = eventosEnFecha.length === 0 || 
      eventosEnFecha.some(e => e.extendedProps['estado'] === 'disponible');

    if (puedeReservar) {
      // Animación al hacer clic
      info.dayEl.style.transform = 'scale(0.95)';
      setTimeout(() => {
        info.dayEl.style.transform = '';
        this.router.navigate(['/reserva', info.dateStr]);
      }, 300);
    } else {
      // Feedback visual para fechas no disponibles
      info.dayEl.style.animation = 'shake 0.5s';
      setTimeout(() => {
        info.dayEl.style.animation = '';
      }, 500);
    }
  }
}