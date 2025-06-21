// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from '../auth/auth.service';
// import { AuthAdminService } from './auth-admin.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private adminService: AuthAdminService,
//     private router: Router
//   ) {}


//   canActivate(): boolean {
//     const user = this.authService.getCurrentUser();
//     if (!user || !user.isAdmin) {
//       this.router.navigate(['/dashboard']);
//       return false;
//     }
//     return true;
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }
    
    console.warn('Acceso denegado: usuario no es administrador');
    this.router.navigate(['/dashboard']);
    return false;
  }
}