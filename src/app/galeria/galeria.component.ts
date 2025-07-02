import { Component, OnInit } from '@angular/core';
import { GaleriaService, ArchivoGaleria  } from '../services/galeria.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  archivos: ArchivoGaleria[] = [];
  modalAbierto: boolean = false;
  archivoSeleccionado: ArchivoGaleria | null = null;

  constructor(private galeriaService: GaleriaService) { }

  ngOnInit(): void {
    this.archivos = this.galeriaService.getArchivos();
  }

   abrirModal(archivo: ArchivoGaleria): void {
    this.archivoSeleccionado = archivo;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.archivoSeleccionado = null; // Limpiar el archivo seleccionado al cerrar el modal
  }
}