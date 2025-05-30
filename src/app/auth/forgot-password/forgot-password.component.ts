import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  requestReset(): void {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = 'Se ha enviado un enlace de recuperación a tu correo electrónico.';
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al enviar el enlace de recuperación. Por favor intenta nuevamente.';
        this.message = '';
      }
    });
  }
}