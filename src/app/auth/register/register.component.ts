// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent implements OnInit {
//   registerForm: FormGroup;
//   verificationSent = false;
//   verificationCode = '';
//   userData: any;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private http: HttpClient
//   ) {
//     this.registerForm = this.fb.group({
//       nombre: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
//       password: ['', [Validators.required, Validators.minLength(8)]],
//       confirmPassword: ['', Validators.required]
//     }, { validators: this.passwordMatchValidator });
//   }

//   passwordMatchValidator(form: FormGroup) {
//     const password = form.get('password')?.value;
//     const confirmPassword = form.get('confirmPassword')?.value;
//     return password === confirmPassword ? null : { mismatch: true };
//   }

//   ngOnInit(): void {}

//   onSubmit(): void {
//     if (this.registerForm.valid) {
//       this.userData = this.registerForm.value;
//       delete this.userData.confirmPassword;
      
//       this.authService.sendVerificationCode(this.userData.email).subscribe({
//         next: () => {
//           this.verificationSent = true;
//         },
//         error: (err) => {
//           console.error('Error sending verification code:', err);
//           alert('Error al enviar el código de verificación');
//         }
//       });
//     }
//   }

// verifyCode() {
//   this.authService.verifyEmailCode(this.email, this.verificationCode).subscribe({
//     next: (response) => {
//       // Código correcto, proceder con registro
//       this.registerUser();
//     },
//     error: (err) => {
//       console.error('Error verifying code:', err);
//       this.errorMessage = err.error?.error || 'Error al verificar el código';
//     }
//   });
// }
// }

///////////////////////
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   registerForm: FormGroup;
//   verificationSent = false;
//   verificationCode = '';
//   verificationToken = '';
//   successMessage = '';
//   errorMessage = '';
//   isLoading = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.registerForm = this.fb.group({
//       nombre: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
//       password: ['', [Validators.required, Validators.minLength(8)]],
//       confirmPassword: ['', Validators.required]
//     }, { validators: this.passwordMatchValidator });
//   }

//   passwordMatchValidator(form: FormGroup) {
//     return form.get('password')?.value === form.get('confirmPassword')?.value 
//       ? null : { mismatch: true };
//   }

//   onSubmit(): void {
//     if (this.registerForm.valid) {
//       this.isLoading = true;
//       this.successMessage = '';
//       this.errorMessage = '';
//       const { confirmPassword, ...userData } = this.registerForm.value;

//       this.authService.sendVerificationCode(userData.email).subscribe({
//         next: () => {
//           this.verificationSent = true;
//           this.successMessage = 'Código enviado al correo electrónico.';
//           this.isLoading = false;
//         },
//         error: (err) => {
//           this.errorMessage = err.error?.error || 'Error al enviar código de verificación';
//           this.isLoading = false;
//         }
//       });
//     }
//   }

// verifyCode(): void {
//   this.isLoading = true;
//   this.successMessage = '';
//   this.errorMessage = '';
//   const email = this.registerForm.get('email')?.value;

//   this.authService.verifyEmailCode(email, this.verificationCode).subscribe({
//     next: (response) => {
//       if (response.success) {
//         this.verificationToken = response.token;
//         this.successMessage = response.message || 'Código verificado correctamente';
//         this.registerUser();
//       } else {
//         this.errorMessage = response.error || 'Código incorrecto';
//         this.isLoading = false;
//       }
//     },
//     error: (err) => {
//       this.errorMessage = err.error?.error || err.message || 'Error al verificar el código';
//       this.isLoading = false;
//     }
//   });
// }


// private registerUser(): void {
//     this.isLoading = true;
//     this.errorMessage = '';
//     const { confirmPassword, ...userData } = this.registerForm.value;
//     const registrationData = {
//       ...userData,
//       verificationToken: this.verificationToken
//     };

//     this.authService.register(registrationData).subscribe({
//       next: () => {
//         this.successMessage = 'Usuario registrado correctamente. Redirigiendo...';
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 2000);
//       },
//       error: (err) => {
//         this.errorMessage = err.message || 'Error al registrar usuario';
//         this.isLoading = false;
//       }
//     });
//   }

// }

////////////////////////////////////////////////

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  verificationSent = false;
  verificationCode = '';
  verificationToken = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.sendVerificationCode(userData.email).subscribe({
        next: () => {
          this.verificationSent = true;
          this.isLoading = false;
          this.snackBar.open('Código enviado al correo electrónico.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.error || 'Error al enviar el código', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  verifyCode(): void {
    this.isLoading = true;
    const email = this.registerForm.get('email')?.value;

    this.authService.verifyEmailCode(email, this.verificationCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.verificationToken = response.token;
          this.snackBar.open(response.message || 'Código verificado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.registerUser();
        } else {
          this.isLoading = false;
          this.snackBar.open(response.error || 'Error al verificar el código', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.error || err.message || 'Error al verificar el código', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  private registerUser(): void {
    this.isLoading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;
    const registrationData = {
      ...userData,
      verificationToken: this.verificationToken
    };

    this.authService.register(registrationData).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado correctamente. Redirigiendo...', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.error || err.message || 'Error al registrar usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
