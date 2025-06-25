import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  reservas: any[] = [];
  usuario: any = null;

  constructor(
  private datePipe: DatePipe,
  private authService: AuthService,
  private router: Router
) {}


  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadReservas();
  }

  loadReservas(): void {
    this.authService.getReservasUsuario(this.usuario.id).subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
      }
    });
  }

  cancelarReserva(reservaId: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.authService.cancelarReserva(reservaId).subscribe({
        next: () => {
          this.loadReservas();
          alert('Reserva cancelada correctamente');
        },
        error: (err) => {
          console.error('Error cancelando reserva:', err);
          alert('No se pudo cancelar la reserva');
        }
      });
    }
  }

mostrarModal: boolean = false;
reservaSeleccionada: any = null;

paypalLink: string = 'https://paypal.me/ArturoPerea519?country.x=MX&locale.x=es_XC';

abrirModalPago(reserva: any): void {
  this.reservaSeleccionada = reserva;
  this.mostrarModal = true;
}

cerrarModalPago(): void {
  this.mostrarModal = false;
}

calcularSaldo(reserva: any): number {
  return reserva.precio - (reserva.precio * 0.5);
}

getWhatsAppLink(telefono: string): string {
  if (!this.reservaSeleccionada) return '';

  const fechaFormateada = this.datePipe.transform(this.reservaSeleccionada.fecha, 'dd/MM/yyyy', 'es-MX');
  const usuario = this.usuario?.nombre || 'cliente';

  const mensaje = `Hola, soy ${usuario}, ya realicé el pago del anticipo de mi reserva '${this.reservaSeleccionada.paquete_nombre}' para el ${fechaFormateada}. Envío el comprobante.`;

  return `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;
}




//  getWhatsAppLink(telefono: string): string {
//    const mensaje = `Hola, ya realicé el pago del anticipo de mi reserva '${this.reservaSeleccionada?.paquete_nombre}' para el ${this.reservaSeleccionada?.fecha}. Envio el comprobante.`;
//    return `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;
//  }

}