import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  emailOrPhone = '';
  message = '';
  error = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  requestReset(): void {
    this.authService.requestPasswordReset(this.emailOrPhone).subscribe({
      next: (response) => {
        this.message = `Hemos enviado un código de verificación a ${response.email}`;
        this.error = '';
        this.snackBar.open('Código enviado al correo', 'Cerrar', { duration: 5000 });

        // Redirigir al reset-password con email
        this.router.navigate(['/reset-password'], {
          queryParams: {
            email: response.email
          }
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al enviar el código. Intenta nuevamente.';
        this.message = '';
        this.snackBar.open(this.error, 'Cerrar', { duration: 5000 });
      }
    });
  }
}