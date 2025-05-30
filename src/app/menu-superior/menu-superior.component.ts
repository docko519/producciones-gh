import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent {

  constructor(public authService: AuthService, private router: Router) { } // Cambia `private` a `public`

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Cierra la sesión
    this.router.navigate(['/login']); // Redirige al login
  }
}