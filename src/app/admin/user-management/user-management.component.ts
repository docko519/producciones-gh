// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { MatDialog } from '@angular/material/dialog';
// import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

// interface User {
//   id: number;
//   nombre: string;
//   email: string;
//   telefono: string;
//   fecha_registro: string;
// }

// @Component({
//   selector: 'app-user-management',
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.css']
// })
// export class UserManagementComponent implements OnInit {
//   users: User[] = [];
//   displayedColumns: string[] = ['nombre', 'email', 'telefono', 'fecha_registro', 'actions'];
//   private apiUrl = 'http://localhost:3000/api/usuarios'; // Ajusta el puerto según tu backend

//   constructor(
//     private http: HttpClient,
//     private dialog: MatDialog
//   ) {}

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.http.get<User[]>(this.apiUrl).subscribe({
//       next: (users) => this.users = users,
//       error: (err) => console.error('Error cargando usuarios:', err)
//     });
//   }

//   // openEditDialog(user?: User): void {
//   //   const dialogRef = this.dialog.open(UserEditDialogComponent, {
//   //     width: '500px',
//   //     data: user || { nombre: '', email: '', telefono: '', password: '' }
//   //   });

//   //   dialogRef.afterClosed().subscribe(result => {
//   //     if (result) {
//   //       if (user?.id) {
//   //         // Actualizar (sin password)
//   //         const { password, ...userData } = result;
//   //         this.http.put(`${this.apiUrl}/${user.id}`, userData).subscribe({
//   //           next: () => this.loadUsers(),
//   //           error: (err) => console.error('Error actualizando usuario:', err)
//   //         });
//   //       } else {
//   //         // Crear nuevo
//   //         this.http.post(this.apiUrl, result).subscribe({
//   //           next: () => this.loadUsers(),
//   //           error: (err) => console.error('Error creando usuario:', err)
//   //         });
//   //       }
//   //     }
//   //   });
//   // }

//   openEditDialog(user?: User): void {
//   const dialogRef = this.dialog.open(UserEditDialogComponent, {
//     width: '500px',
//     data: user || { nombre: '', email: '', telefono: '', password: '' }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       if (user?.id) {
//         // Actualización (excluye password)
//         const { password, ...updateData } = result;
//         this.http.put(`${this.apiUrl}/${user.id}`, updateData).subscribe({
//           next: () => {
//             console.log('Usuario actualizado correctamente');
//             this.loadUsers();
//           },
//           error: (err) => console.error('Error actualizando usuario:', err)
//         });
//       } else {
//         // Creación (incluye password)
//         this.http.post(this.apiUrl, result).subscribe({
//           next: () => {
//             console.log('Usuario creado correctamente');
//             this.loadUsers();
//           },
//           error: (err) => console.error('Error creando usuario:', err)
//         });
//       }
//     }
//   });
// }

//   deleteUser(id: number): void {
//     if (confirm('¿Eliminar este usuario permanentemente?')) {
//       this.http.delete(`${this.apiUrl}/${id}`).subscribe({
//         next: () => this.loadUsers(),
//         error: (err) => console.error('Error eliminando usuario:', err)
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha_registro: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['nombre', 'email', 'telefono', 'fecha_registro', 'actions'];
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  openEditDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: user || { nombre: '', email: '', telefono: '', password: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user?.id) {
          const { password, ...updateData } = result;
          this.http.put(`${this.apiUrl}/${user.id}`, updateData).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Error actualizando usuario:', err)
          });
        } else {
          this.http.post(this.apiUrl, result).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Error creando usuario:', err)
          });
        }
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Eliminar este usuario permanentemente?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error eliminando usuario:', err)
      });
    }
  }
}