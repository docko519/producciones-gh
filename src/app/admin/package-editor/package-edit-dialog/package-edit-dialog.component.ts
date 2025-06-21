import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Define la interfaz Package aquí mismo si no la tienes en otro archivo
export interface Package {
  id?: number;  // El ? indica que es opcional (para nuevos paquetes)
  nombre: string;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-package-edit-dialog',
  templateUrl: './package-edit-dialog.component.html',
  styleUrls: ['./package-edit-dialog.component.css']
})
export class PackageEditDialogComponent {
  packageForm: FormGroup;
  isNewPackage: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PackageEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Package,
    private snackBar: MatSnackBar
  ) {
    this.isNewPackage = !data?.id;
    
    this.packageForm = this.fb.group({
      nombre: [data?.nombre || '', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      descripcion: [data?.descripcion || '', Validators.required],
      precio: [data?.precio || 0, [
        Validators.required,
        Validators.min(0.01)
      ]]
    });
  }

  onSave(): void {
    if (this.packageForm.valid) {
      const formData = this.packageForm.value;
      // Convertir precio a número
      formData.precio = parseFloat(formData.precio);
      this.dialogRef.close(formData);
    } else {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}