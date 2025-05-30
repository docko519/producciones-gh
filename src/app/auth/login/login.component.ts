import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      telefono: ['', Validators.required], // Asegúrate de que este campo esté configurado
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
  
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.authService.setCurrentUser(response.user);
  
          if (response.user?.isAdmin) {
            this.router.navigate(['/admin/reservas']); // ✅ Aquí va la vista admin
          } else {
            this.router.navigate(['/calendario']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert(err.error?.error || 'Credenciales incorrectas');
        }
      });
    }
  }
  
  
}