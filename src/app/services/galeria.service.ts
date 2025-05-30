import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private archivos: string[] = [
    'assets/galeria/Logo1.jpg',
    'assets/galeria/Logo2.jpg',
    'assets/galeria/Video1.mp4',
    'assets/galeria/prueba1.jpg',
    'assets/galeria/prueba2.jpg',
    'assets/galeria/prueba3.jpg',
    'assets/galeria/prueba4.jpg',
    'assets/galeria/prueba5.jpg',
    'assets/galeria/prueba6.jpg',
    'assets/galeria/prueba7.jpg',
    'assets/galeria/prueba8.jpg',
    'assets/galeria/prueba9.jpg',
    'assets/galeria/prueba10.jpg',
    'assets/galeria/prueba11.jpg',
    'assets/galeria/prueba12.jpg'
    
    // Agrega aquí más archivos
  ];

  constructor() { }

  getArchivos(): string[] {
    return this.archivos;
  }
}