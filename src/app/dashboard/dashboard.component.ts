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
  welcomeMessage: string = ''; 
  usuario: any ;

  constructor(private authService: AuthService, private router: Router) {}

ngOnInit(): void {
  this.usuario = this.authService.getCurrentUser();
  console.log('Usuario en dashboard:', this.usuario); // Verifica datos
  
  if (!this.usuario) {
    this.router.navigate(['/login']);
    return;
  }
  
  this.welcomeMessage = `Bienvenid@ ${this.usuario.nombre}`; // ✅ Moved outside if
  this.loadReservas();
}

loadReservas(): void {
  if (!this.usuario?.id) { // ✅ Verifica primero
    console.error('No hay ID de usuario');
    return;
  }

  this.authService.getReservasUsuario(this.usuario.id).subscribe({
    next: (reservas) => {
      console.log('Reservas recibidas:', reservas); // Verifica datos
      this.reservas = reservas || []; // Asegura array
    },
    error: (err) => {
      console.error('Error cargando reservas:', err);
      this.reservas = []; // Reset en caso de error
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