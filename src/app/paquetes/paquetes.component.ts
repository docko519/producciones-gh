import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css']
})
export class PaquetesComponent implements OnInit {
  paquetes: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('Iniciando PaquetesComponent'); // Log de inicio
    this.authService.getPaquetes().subscribe(
      (data: any[]) => {
        console.log('Datos recibidos:', data); // Log de datos recibidos
        this.paquetes = data;
      },
      (error) => {
        console.error('Error obteniendo paquetes:', error); // Log de error
      }
    );
  }
}