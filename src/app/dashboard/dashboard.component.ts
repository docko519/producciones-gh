import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  reservas: any[] = [];
  usuario: any = null;

  constructor(private authService: AuthService, private router: Router) {}

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
}