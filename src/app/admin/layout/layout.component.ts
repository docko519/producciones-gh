import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para pipes comunes

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule], // Añade CommonModule para pipes
  template: `
    <div class="admin-container">
      <nav class="admin-nav">
        <a routerLink="/admin/reservas" routerLinkActive="active">Reservas</a>
        <a routerLink="/admin/usuarios" routerLinkActive="active">Usuarios</a>
        <a routerLink="/admin/paquetes" routerLinkActive="active">Paquetes</a>
      </nav>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { display: flex; min-height: 100vh; }
    .admin-nav { width: 200px; background: #f8f9fa; padding: 20px; }
    .admin-content { flex: 1; padding: 20px; }
    .active { font-weight: bold; color: #007bff; }
  `]
})
export class LayoutComponent {}