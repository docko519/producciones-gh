// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthAdminService {
//   private apiUrl = 'http://localhost:3000/api/admin';

//   constructor(private http: HttpClient) { }

//   getReservas() {
//     return this.http.get(`${this.apiUrl}/reservas`);
//   }

//   updateReserva(id: number, estado: string) {
//     return this.http.put(`${this.apiUrl}/reservas/${id}`, { estado });
//   }

//   isAdmin(telefono: string) {
//     return this.http.get(`${this.apiUrl}/is-admin?telefono=${telefono}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getReservas() {
    const telefono = JSON.parse(localStorage.getItem('user') || '{}')?.telefono;
    return this.http.get(`${this.apiUrl}/admin/reservas?telefono=${telefono}`);
  }

  updateReserva(id: number, estado: string) {
    const telefono = JSON.parse(localStorage.getItem('user') || '{}')?.telefono;
    return this.http.put(`${this.apiUrl}/admin/reservas/${id}?telefono=${telefono}`, { estado });
  }

  isAdmin(telefono: string) {
    return this.http.get(`${this.apiUrl}/auth/is-admin?telefono=${telefono}`);
  }

  deleteReserva(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/reservas/${id}`);
}

}
