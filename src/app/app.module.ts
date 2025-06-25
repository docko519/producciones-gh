import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Este ya incluye RouterModule
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

// Componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { FullCalendarComponent } from './full-calendar/full-calendar.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { ReservaComponent } from './reserva/reserva.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ContratoComponent } from './contrato/contrato.component';
import { PaquetesComponent } from './paquetes/paquetes.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalendarioComponent,
    FullCalendarComponent,
    MenuSuperiorComponent,
    PiePaginaComponent,
    ReservaComponent,
    InformacionComponent,
    ContratoComponent,
    PaquetesComponent,
    GaleriaComponent
  ],
  imports: [
    
    BrowserModule,       // Siempre primero (contiene CommonModule)
    HttpClientModule, // Segundo
    BrowserAnimationsModule, 
    MatSnackBarModule,   
    AppRoutingModule,    // Contiene RouterModule, NO necesitas importarlo por separado
    AuthModule,
    RouterModule.forRoot([])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }