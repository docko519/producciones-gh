import { Injectable } from '@angular/core';

export interface ArchivoGaleria {
  url: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private archivos: ArchivoGaleria[] = [
//IMAGENES
  { url: 'assets/galeria/IMG.jpg', descripcion: 'DJ JOU, LOGO DE PRODUCCIONES GH' },
    { url: 'assets/galeria/IMG 1.jpg', descripcion: 'DOCKO DJ, EN EVENTO PRIVADO' },
    { url: 'assets/galeria/IMG 2.jpg', descripcion: 'EQUIPO DE AUDIO ALQUILADO, (Contrato solo cabina)' },
    { url: 'assets/galeria/IMG 3.jpg', descripcion: 'EQUIPO DE AUDIO ALQUILADO, (Contrato solo cabina)' },
    { url: 'assets/galeria/IMG 4.jpg', descripcion: 'DOCKO DJ, EN EVENTO PRIVADO' },
    { url: 'assets/galeria/IMG 5.jpg', descripcion: 'Paquete ORO: Equipo que incluye' },
    { url: 'assets/galeria/IMG 6.jpg', descripcion: 'PRODUCCIONES GH, EVENTO PRIVADO' },
    { url: 'assets/galeria/IMG 7.jpg', descripcion: 'PRODUCCIONES GH, EN BODA' },
    { url: 'assets/galeria/IMG 8.jpg', descripcion: 'Paquete BRONCE: Equipo que incluye' },
    { url: 'assets/galeria/IMG 9.jpg', descripcion: 'PRODUCCIONES GH, EVENTO PRIVADO' },
    { url: 'assets/galeria/IMG 10.jpg', descripcion: 'FOTO CON AMIGOS, PRODUCCIONES GH' },
    { url: 'assets/galeria/IMG 11.jpg', descripcion: 'PRODUCCIONES GH, EQUIPO COMPLETO' },
    //VIDEOS

    { url: 'assets/galeria/Video.mp4', descripcion: 'Muestra del equipo en funcionamiento (PAQUETE PLATINO)' },
    { url: 'assets/galeria/Video 1.mp4', descripcion: 'Set de musica en vivo (DOCKO DJ)' },
    { url: 'assets/galeria/Video 2.mp4', descripcion: 'PREVIEW EVENTO CON EQUIPO ALQUILADO' },
    { url: 'assets/galeria/Video 3.mp4', descripcion: 'Fiesta de cumpleaños' },
    { url: 'assets/galeria/Video 4.mp4', descripcion: 'INTRODUCCION AL EVENTO (EQUIPO ALQUILADO)' },
    { url: 'assets/galeria/Video 5.mp4', descripcion: 'Luces y sonido en acción (Paquete BRONCE)' },
    { url: 'assets/galeria/Video 6.mp4', descripcion: 'Ambiente durante una BODA' },

     // Agrega aquí más archivos
  ];



  constructor() { }

  getArchivos(): ArchivoGaleria[] {
    return this.archivos;
  }
}