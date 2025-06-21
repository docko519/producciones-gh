import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PackageEditDialogComponent } from './package-edit-dialog/package-edit-dialog.component';

interface Package {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface ApiResponse {
  success?: boolean;
  data?: Package[];
}

@Component({
  selector: 'app-package-editor',
  templateUrl: './package-editor.component.html',
  styleUrls: ['./package-editor.component.css']
})
export class PackageEditorComponent implements OnInit {
  dataSource = new MatTableDataSource<Package>([]);
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'actions'];
  isLoading = true;
  private apiUrl = 'http://localhost:3000/api/admin/paquetes';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPackages(): void {
    this.isLoading = true;
    
    this.http.get<Package[] | ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        const paquetes: Package[] = Array.isArray(response) ? response : 
                                   (response?.data || []);
        
        // Verificar duplicados por nombre
        const uniquePackages = this.removeDuplicates(paquetes, 'nombre');
        
        this.dataSource.data = uniquePackages.map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio
        }));
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.snackBar.open('Error al cargar paquetes', 'Cerrar', { duration: 3000 });
        this.dataSource.data = [];
        this.isLoading = false;
      }
    });
  }

  private removeDuplicates(array: Package[], key: keyof Package): Package[] {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => t[key] === item[key])
    );
  }

  openEditDialog(pkg?: Package): void {
    const dialogRef = this.dialog.open(PackageEditDialogComponent, {
      width: '600px',
      data: pkg ? {...pkg} : { nombre: '', descripcion: '', precio: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (pkg?.id) {
          this.updatePackage(pkg.id, result);
        } else {
          this.createPackage(result);
        }
      }
    });
  }

  createPackage(newPackage: Omit<Package, 'id'>): void {
    // Validar duplicados antes de crear
    const isDuplicate = this.dataSource.data.some(p => 
      p.nombre.toLowerCase() === newPackage.nombre.toLowerCase()
    );

    if (isDuplicate) {
      this.snackBar.open('Ya existe un paquete con este nombre', 'Cerrar', { duration: 3000 });
      return;
    }

    this.http.post<Package>(this.apiUrl, newPackage).subscribe({
      next: (createdPackage) => {
        this.snackBar.open('Paquete creado', 'Cerrar', { duration: 2000 });
        this.loadPackages(); // Recargar para mantener consistencia
      },
      error: (err) => this.handleError(err, 'crear')
    });
  }

  updatePackage(id: number, updatedPackage: Omit<Package, 'id'>): void {
    // Validar duplicados antes de actualizar
    const isDuplicate = this.dataSource.data.some(p => 
      p.id !== id && p.nombre.toLowerCase() === updatedPackage.nombre.toLowerCase()
    );

    if (isDuplicate) {
      this.snackBar.open('Ya existe otro paquete con este nombre', 'Cerrar', { duration: 3000 });
      return;
    }

    this.http.put<Package>(`${this.apiUrl}/${id}`, updatedPackage).subscribe({
      next: () => {
        this.snackBar.open('Paquete actualizado', 'Cerrar', { duration: 2000 });
        this.loadPackages(); // Recargar para mantener consistencia
      },
      error: (err) => this.handleError(err, 'actualizar')
    });
  }

  deletePackage(id: number): void {
    if (confirm('¿Eliminar este paquete permanentemente?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.snackBar.open('Paquete eliminado', 'Cerrar', { duration: 2000 });
          this.loadPackages();
        },
        error: (err) => this.handleError(err, 'eliminar')
      });
    }
  }

  private handleError(err: any, action: string): void {
    console.error(`Error al ${action} paquete:`, err);
    const errorMsg = err.error?.error || `Error al ${action} paquete`;
    this.snackBar.open(errorMsg, 'Cerrar', { duration: 3000 });
  }
}