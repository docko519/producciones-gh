import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: any[] = [];

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