import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrls: ['./pie-pagina.component.css']
})
export class PiePaginaComponent implements OnInit {
  administradores: any[] = []; // Variable para almacenar los datos de los administradores

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAdministradores().subscribe(
      (data: any[]) => {
        console.log('Datos de administradores:', data); // Verifica los datos recibidos
        this.administradores = data;
      },
      (error) => {
        console.error('Error obteniendo administradores:', error);
      }
    );
  }
}  