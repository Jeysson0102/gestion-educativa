import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];

  if (allowedRoles.includes(authService.userRole || '')) return true;

  alert('Acceso Denegado: Rol insuficiente');
  router.navigate(['/dashboard/home']);
  return false;
};