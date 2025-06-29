import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CalendarService } from '../services/calendar.service';
import { lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  fechaSeleccionada: string = '';
  paquetes: any[] = [];
  paqueteSeleccionado: any = null;
  usuario: any = null;
  mostrarConfirmacion: boolean = false;
  estadoReserva: string = '';
  mensajeEstado: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.fechaSeleccionada = this.route.snapshot.paramMap.get('fecha') || '';
    this.usuario = this.authService.getCurrentUser();

    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadPaquetes();
  }

  private loadPaquetes(): void {
    this.authService.getPaquetes().subscribe({
      next: (paquetes) => this.paquetes = paquetes,
      error: (err) => console.error('Error cargando paquetes:', err)
    });
  }

  seleccionarPaquete(paquete: any): void {
    this.paqueteSeleccionado = paquete;
  }

  confirmarReserva(): void {
    if (!this.paqueteSeleccionado) {
      alert('Por favor selecciona un paquete');
      return;
    }
    this.mostrarConfirmacion = true;
  }

  cancelarReserva(): void {
    this.paqueteSeleccionado = null;
    this.mostrarConfirmacion = false;
  }

  async finalizarReserva(): Promise<void> {
    if (!this.paqueteSeleccionado) {
      alert('Por favor selecciona un paquete');
      return;
    }

    try {
      const reservaData = {
        usuario_id: this.usuario.id,
        fecha: this.fechaSeleccionada,
        paquete_id: this.paqueteSeleccionado.id,
        usuario_nombre: this.usuario.nombre,
        usuario_email: this.usuario.email,
        paquete_nombre: this.paqueteSeleccionado.nombre
      };

      const response = await lastValueFrom(
        this.authService.crearReserva(reservaData).pipe(take(1))
      );

      alert('¡Reserva creada correctamente!');
      this.calendarService.notifyCalendarUpdate();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error creando reserva:', error);
      alert(error.message || 'Error al crear reserva');
      this.cancelarReserva();
    }
  }
}
