import { Component, OnInit } from '@angular/core';
import { GaleriaService } from '../services/galeria.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  archivos: string[] = [];
  modalAbierto: boolean = false;
  archivoSeleccionado: string = '';

  constructor(private galeriaService: GaleriaService) { }

  ngOnInit(): void {
    this.archivos = this.galeriaService.getArchivos();
  }

  abrirModal(archivo: string): void {
    this.archivoSeleccionado = archivo;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.archivoSeleccionado = ''; // Limpiar el archivo seleccionado al cerrar el modal
  }
}