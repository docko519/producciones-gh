// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { AdminRoutingModule } from './admin-routing.module';
// import { ReservasComponent } from './reservas/reservas.component';
// import { UserManagementComponent } from './user-management/user-management.component';
// import { PackageEditorComponent } from './package-editor/package-editor.component';
// import { LayoutComponent } from './layout/layout.component';
// import { DatePipe } from '@angular/common';
// import { UserEditDialogComponent } from './user-management/user-edit-dialog/user-edit-dialog.component';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button'; // Importa el componente standalone aquí



// @NgModule({
//   declarations: [
//     ReservasComponent,
//     UserManagementComponent,
//     PackageEditorComponent,
//     UserEditDialogComponent
//     // Remueve LayoutComponent de aquí
//   ],
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule,
//     AdminRoutingModule,
//     LayoutComponent,
//     MatDialogModule,
//     MatTableModule,
//     MatButtonModule 
//   ],
//   providers: [DatePipe]
// })
// export class AdminModule { }
/////////////////////////////////////
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { AdminRoutingModule } from './admin-routing.module';
// import { ReservasComponent } from './reservas/reservas.component';
// import { UserManagementComponent } from './user-management/user-management.component';
// import { PackageEditorComponent } from './package-editor/package-editor.component';
// import { LayoutComponent } from './layout/layout.component';
// import { DatePipe } from '@angular/common';
// import { UserEditDialogComponent } from './user-management/user-edit-dialog/user-edit-dialog.component';
// import { BrowserModule } from '@angular/platform-browser';

// // Angular Material Modules
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field'; // <-- Añade esto
// import { MatInputModule } from '@angular/material/input'; // <-- Añade esto
// import { MatIconModule } from '@angular/material/icon'; // <-- Opcional para íconos

// @NgModule({
//   declarations: [
//     ReservasComponent,
//     UserManagementComponent,
//     PackageEditorComponent,
//     UserEditDialogComponent
//   ],
//   imports: [
//     BrowserModule,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule,
//     AdminRoutingModule,
//     LayoutComponent,
//     MatDialogModule,
//     MatTableModule,
//     MatButtonModule,
//     MatFormFieldModule, // <-- Añadido
//     MatInputModule, // <-- Añadido
//     MatIconModule,
//   ],
//   providers: [DatePipe]
// })
// export class AdminModule { }

//////////////////////////////////////////
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';



// Componentes
import { ReservasComponent } from './reservas/reservas.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { PackageEditorComponent } from './package-editor/package-editor.component';
import { LayoutComponent } from './layout/layout.component';
import { UserEditDialogComponent } from './user-management/user-edit-dialog/user-edit-dialog.component';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatePipe } from '@angular/common';
import { PackageEditDialogComponent } from './package-editor/package-edit-dialog/package-edit-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    ReservasComponent,
    UserManagementComponent,
    PackageEditorComponent,
    UserEditDialogComponent,
    PackageEditDialogComponent
    
  ],
  imports: [
    CommonModule, // Usar CommonModule en módulos hijos
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    LayoutComponent,
    // Angular Material Modules
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule

  
  ],
  providers: [DatePipe]
})
export class AdminModule { }