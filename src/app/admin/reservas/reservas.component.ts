// import { Component, OnInit } from '@angular/core';
// import { AuthAdminService } from '../auth-admin.service';

// @Component({
//   selector: 'app-reservas',
//   templateUrl: './reservas.component.html',
//   styleUrls: ['./reservas.component.css']
// })
// export class ReservasComponent implements OnInit {
//   reservas: any[] = [];
//   estados = ['pendiente', 'confirmada', 'cancelada'];

//   constructor(private adminService: AuthAdminService) { }

//   ngOnInit(): void {
//     this.loadReservas();
//   }

//   loadReservas() {
//     this.adminService.getReservas().subscribe({
//       next: (reservas: any) => this.reservas = reservas,
//       error: (err) => console.error('Error cargando reservas:', err)
//     });
//   }

//   updateEstado(reservaId: number, nuevoEstado: string) {
//     this.adminService.updateReserva(reservaId, nuevoEstado).subscribe({
//       next: () => this.loadReservas(),
//       error: (err) => console.error('Error actualizando reserva:', err)
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthAdminService } from '../auth-admin.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: any[] = [];
  estados = ['pendiente', 'confirmada', 'cancelada'];

  constructor(
    private adminService: AuthAdminService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.adminService.getReservas().subscribe({
      next: (res: any) => this.reservas = res,
      error: (err) => console.error('Error al cargar reservas:', err)
    });
  }

  updateEstado(id: number, estado: string): void {
    const reserva = this.reservas.find(r => r.id === id);
    if (!reserva) return;

    const datos = {
      estado,
      email: reserva.email,
      nombre: reserva.cliente,
      paquete: reserva.paquete,
      fecha: reserva.fecha
    };

    this.http.put(`http://localhost:3000/api/admin/reservas/${id}`, datos).subscribe({
      next: () => {
        this.snackBar.open(`Estado actualizado a ${estado}`, 'Cerrar', { duration: 3000 });
        this.loadReservas();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarReserva(id: number): void {
    this.adminService.deleteReserva(id).subscribe({
      next: () => this.loadReservas(),
      error: (err) => console.error('Error al eliminar reserva:', err)
    });
  }
}

