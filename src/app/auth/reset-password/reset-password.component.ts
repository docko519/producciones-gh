// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-reset-password',
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css']
// })
// export class ResetPasswordComponent {
//   token = '';
//   email = '';
//   verificationCode = '';
//   newPassword = '';
//   confirmPassword = '';
//   message = '';
//   error = '';
//   isCodeVerified = false;
//   isLoading = false;
//   timeLeft = 0;
//   timerInterval: any;

//   constructor(
//     private route: ActivatedRoute,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.token = this.route.snapshot.queryParamMap.get('token') || '';
//     this.email = this.route.snapshot.queryParamMap.get('email') || '';
    
//     if (this.email) {
//       this.startTimer(15 * 60); // 15 minutos
//     }
//   }

//   startTimer(seconds: number) {
//     this.timeLeft = seconds;
//     this.timerInterval = setInterval(() => {
//       if (this.timeLeft > 0) {
//         this.timeLeft--;
//       } else {
//         clearInterval(this.timerInterval);
//       }
//     }, 1000);
//   }

//   verifyCode() {
//     if (!this.verificationCode || this.verificationCode.length !== 6) {
//       this.error = 'Por favor ingresa un código válido de 6 dígitos';
//       return;
//     }

//     this.isLoading = true;
//     this.error = '';

//     this.authService.verifyCode(this.email, this.verificationCode).subscribe({
//       next: (response) => {
//         this.isCodeVerified = true;
//         this.token = response.token;
//         clearInterval(this.timerInterval);
//       },
//       error: (err) => {
//         this.error = err.error?.error || 'Error al verificar el código';
//       },
//       complete: () => this.isLoading = false
//     });
//   }

//   resetPassword() {
//     if (this.newPassword !== this.confirmPassword) {
//       this.error = 'Las contraseñas no coinciden';
//       return;
//     }

//     this.isLoading = true;
//     this.error = '';

//     this.authService.resetPassword(this.token, this.newPassword).subscribe({
//       next: () => {
//         this.message = 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.';
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 3000);
//       },
//       error: (err) => {
//         this.error = err.error?.error || 'Error al actualizar la contraseña. El enlace puede haber expirado.';
//       },
//       complete: () => this.isLoading = false
//     });
//   }

//   ngOnDestroy() {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//   }
// }

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  verificationCode = '';
  newPassword = '';
  confirmPassword = '';
  isCodeVerified = false;
  isLoading = false;
  message = '';
  error = '';
  timeLeft = 0;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Leer desde query param (correo real)
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    if (this.email) {
      this.startTimer(15 * 60); // 15 minutos
    }
  }

  startTimer(seconds: number): void {
    this.timeLeft = seconds;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  verifyCode(): void {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.snackBar.open('Por favor ingresa un código válido de 6 dígitos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.authService.verifyCode(this.email, this.verificationCode).subscribe({
      next: (res) => {
        this.isCodeVerified = true;
        this.token = res.token;
        this.snackBar.open('Código verificado correctamente', 'Cerrar', { duration: 3000 });
        clearInterval(this.timerInterval);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error al verificar código', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.snackBar.open('Contraseña restablecida correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error al actualizar contraseña', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private token = '';
}
