import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReservasComponent } from './reservas/reservas.component';
import { AdministradoresComponent } from './administradores/administradores.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'administradores', component: AdministradoresComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    ReservasComponent,
    AdministradoresComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }