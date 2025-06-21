// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AdminComponent } from './admin.component';

// const routes: Routes = [{ path: '', component: AdminComponent }];


// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component'; // Nombre correcto
import { ReservasComponent } from './reservas/reservas.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { PackageEditorComponent } from './package-editor/package-editor.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Nombre correcto
    children: [
      { path: 'reservas', component: ReservasComponent },
      { path: 'usuarios', component: UserManagementComponent },
      { path: 'paquetes', component: PackageEditorComponent },
      { path: '', redirectTo: 'reservas', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}