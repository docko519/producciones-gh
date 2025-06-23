import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FullCalendarComponent } from 'src/app/full-calendar/full-calendar.component';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: any[] = [];
  loading = false;
  prepararEnlace(admin: any): string {
  // Devuelve el enlace deseado, por ejemplo:
  return `/admin/editar/${admin.id}`;
}

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadAdministradores();
  }

  loadAdministradores() {
    this.authService.getAdministradores().subscribe({
      next: (admins: any) => this.administradores = admins,
      error: (err) => console.error('Error cargando admins:', err)
    });
  }
}