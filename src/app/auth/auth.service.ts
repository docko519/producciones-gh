import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrlGeneral = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ───────────────────────────────────────
  // Sesión y autenticación
  // ───────────────────────────────────────
  login(credentials: { telefono: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError(error => {
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

  logout(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin === true;
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ───────────────────────────────────────
  // Registro y verificación de usuario
  // ───────────────────────────────────────
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  verifyEmailCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, code }).pipe(
      catchError(error => {
        const errorMsg = error.error?.error || 
                         error.error?.message || 
                         'Error al verificar el código';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        const errorMsg = error.error?.error || 
                         error.error?.message || 
                         'Error al registrar usuario';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // ───────────────────────────────────────
  // Recuperación de contraseña
  // ───────────────────────────────────────
requestPasswordReset(emailOrPhone: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/request-password-reset`, {
    email: emailOrPhone
  }).pipe(
    catchError(this.handleError)
  );
}


  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
}

  // resetPassword(token: string, newPassword: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // ───────────────────────────────────────
  // Funcionalidades generales
  // ───────────────────────────────────────
  getFechasDisponibles(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrlGeneral}/fechas-disponibles`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
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

  // ───────────────────────────────────────
  // Manejo de errores
  // ───────────────────────────────────────
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.error || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
