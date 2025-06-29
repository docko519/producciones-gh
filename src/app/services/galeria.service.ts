import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private archivos: string[] = [
//IMAGENES
    'assets/galeria/IMG.jpg',
    'assets/galeria/IMG 1.jpg',
    'assets/galeria/IMG 2.jpg',
    'assets/galeria/IMG 3.jpg',
    'assets/galeria/IMG 4.jpg',
    'assets/galeria/IMG 5.jpg',
    'assets/galeria/IMG 6.jpg',
    'assets/galeria/IMG 7.jpg',
    'assets/galeria/IMG 8.jpg',
    'assets/galeria/IMG 9.jpg',
    'assets/galeria/IMG 10.jpg',
    'assets/galeria/IMG 11.jpg',

    //VIDEOS
    'assets/galeria/Video.mp4',
    'assets/galeria/Video 1.mp4',
    'assets/galeria/Video 2.mp4',
    'assets/galeria/Video 3.mp4',
    'assets/galeria/Video 4.mp4',
    'assets/galeria/Video 5.mp4',
    'assets/galeria/Video 6.mp4',

    
    // Agrega aquí más archivos
  ];

  constructor() { }

  getArchivos(): string[] {
    return this.archivos;
  }
}