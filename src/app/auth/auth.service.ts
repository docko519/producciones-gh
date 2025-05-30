import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrlGeneral = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.isAdmin : false;
  }

  login(credentials: { telefono: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError(error => {
        // Mejor manejo de errores
        let errorMessage = 'Error desconocido';
        if (error.status === 401) {
          errorMessage = 'Teléfono o contraseña incorrectos';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(userData: { nombre: string, email: string, telefono: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  getFechasDisponibles(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrlGeneral}/fechas-disponibles`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getPaquetes(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrlGeneral}/paquetes`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getAdministradores(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrlGeneral}/administradores`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  crearReserva(reservaData: any): Observable<any> {
    return this.http.post(`${this.apiUrlGeneral}/reservas`, reservaData).pipe(
      catchError(this.handleError)
    );
  }

  getEventosCalendario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlGeneral}/eventos-calendario`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.error || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  verifyEmail(userData: any, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { ...userData, code }).pipe(
      catchError(this.handleError)
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(this.handleError)
    );
  }



  getReservasUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlGeneral}/reservas/usuario/${usuarioId}`).pipe(
      catchError(this.handleError)
    );
  }
  
  cancelarReserva(reservaId: number): Observable<any> {
    return this.http.put(`${this.apiUrlGeneral}/reservas/${reservaId}/cancelar`, {}).pipe(
      catchError(this.handleError)
    );
  }

}


