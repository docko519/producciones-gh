import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  verificationSent = false;
  verificationCode = '';
  userData: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
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
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userData = this.registerForm.value;
      delete this.userData.confirmPassword;
      
      this.authService.sendVerificationCode(this.userData.email).subscribe({
        next: () => {
          this.verificationSent = true;
        },
        error: (err) => {
          console.error('Error sending verification code:', err);
          alert('Error al enviar el código de verificación');
        }
      });
    }
  }

  verifyCode(): void {
    this.authService.verifyEmail(this.userData, this.verificationCode).subscribe({
      next: (response) => {
        alert('Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error verifying code:', err);
        alert('Código de verificación incorrecto');
      }
    });
  }
}