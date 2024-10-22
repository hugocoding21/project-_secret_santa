import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth-service';
import { GroupHttpClientService } from '@app/shared/services/group-http-client.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupAccessGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private groupService: GroupHttpClientService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const groupId = route.paramMap.get('id'); 

    if (!groupId) {
      return Promise.resolve(false);
    }

    const user = this.authService.getUser();

    // Vérifie si l'utilisateur fait partie du groupe
    return this.groupService.isUserOrOwnerInGroup(groupId, user?.id).pipe(
      map((response:any) => {
        console.log(response);
        
        const isMember = response.isMember || response.isOwner; // Assurez-vous d'avoir cette logique dans votre service
        if (!isMember) {
          this.router.navigate(['/dashboard']); 
          return false;
        }
        return true;
      }),
      catchError((error) => {
        console.error('Error checking group membership:', error);
        this.router.navigate(['/dashboard']); 
        return of(false); // Retourne false en cas d'erreur
      })
    ).toPromise();
  }
}
