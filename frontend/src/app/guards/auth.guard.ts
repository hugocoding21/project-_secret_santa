import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../shared/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.tokenStorage.getRefreshToken();    
    if (this.isTokenValid(token)) {
      // const requiredRoles = route.data.roles as string[];

      // Si des rôles sont spécifiés, vérifie si l'utilisateur a l'un des rôles requis
      // if (requiredRoles && !this.hasRequiredRole(requiredRoles)) {
      //   this.router.navigate(['/unauthorized']); // Redirige vers une page d'accès non autorisé
      //   return false;
      // }

      return true; // L'accès est accordé
    } else {
      // Redirige vers la page de connexion si pas de token
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  private isTokenValid(token: string | null): boolean {
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  private hasRequiredRole(requiredRoles: string[]): boolean {
    const user = JSON.parse(localStorage.getItem('secret-santa-user') || '{}');
    return user.roles && user.roles.some((role: string) => requiredRoles.includes(role));
  }
}
