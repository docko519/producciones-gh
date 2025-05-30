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

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: any[] = [];
  estados = ['pendiente', 'confirmada', 'cancelada', 'rechazada'];

  constructor(private adminService: AuthAdminService) {}

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
    this.adminService.updateReserva(id, estado).subscribe({
      next: () => this.loadReservas(),
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }
}
