import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private updateCalendarSource = new Subject<void>();
  private dateSelectedSource = new Subject<string>();

  updateCalendar$ = this.updateCalendarSource.asObservable();
  dateSelected$ = this.dateSelectedSource.asObservable();

  notifyCalendarUpdate(): void {
    this.updateCalendarSource.next();
  }

  notifyDateSelected(date: string): void {
    this.dateSelectedSource.next(date);
  }
}