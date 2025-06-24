import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent implements OnInit {

  ngOnInit() {
    const modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    if (modoOscuro) document.body.classList.add('dark-mode');
  }
    toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('modoOscuro', isDark.toString());
  }
  constructor(public authService: AuthService, private router: Router) { } // Cambia `private` a `public`

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Cierra la sesión
    this.router.navigate(['/login']); // Redirige al login
  }
}