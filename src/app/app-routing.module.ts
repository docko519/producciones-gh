import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { ReservaComponent } from './reserva/reserva.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ContratoComponent } from './contrato/contrato.component';
import { PaquetesComponent } from './paquetes/paquetes.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './admin/admin.guard';

// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'forgot-password', component: ForgotPasswordComponent },
//   { path: 'reset-password', component: ResetPasswordComponent },
//   { 
//     path: 'dashboard', 
//     component: DashboardComponent,
//     canActivate: [AuthGuard]
//   },
//   { 
//     path: 'calendario', 
//     component: CalendarioComponent,
//     canActivate: [AuthGuard]
//   },
//   { 
//     path: 'reserva/:fecha', 
//     component: ReservaComponent,
//     canActivate: [AuthGuard]
//   },
//   { path: 'informacion', component: InformacionComponent },
//   { path: 'contrato', component: ContratoComponent },
//   { path: 'paquetes', component: PaquetesComponent },
//   { path: 'galeria', component: GaleriaComponent },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: '**', redirectTo: '/dashboard' },
//   { 
//     path: 'admin', 
//     loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
//     canActivate: [AuthGuard, AdminGuard] 
//   },
 
// ];

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'calendario', 
    component: CalendarioComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reserva/:fecha', 
    component: ReservaComponent,
    canActivate: [AuthGuard]
  },
  { path: 'informacion', component: InformacionComponent },
  { path: 'contrato', component: ContratoComponent },
  { path: 'paquetes', component: PaquetesComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }