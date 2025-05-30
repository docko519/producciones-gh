import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCalendarComponent } from './full-calendar.component';

describe('FullCalendarComponent', () => {
  let component: FullCalendarComponent;
  let fixture: ComponentFixture<FullCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullCalendarComponent]
    });
    fixture = TestBed.createComponent(FullCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
