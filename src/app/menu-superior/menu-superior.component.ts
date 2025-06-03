import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent {
  //  usuario: Usuario | null = null;
   usuario: any;

  constructor(public authService: AuthService, private router: Router) { } 

    ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    console.log('Usuario en menú:', this.usuario); // Verifica en consola
  }
  // Método para cerrar sesión
  logout(): void {
    
    this.authService.logout(); // Cierra la sesión
    this.router.navigate(['/login']); // Redirige al login

  }
}