import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/shared/services/auth-service';
import { environment } from '@environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const account = this.authService.getUser();
    const isLoggedIn = this.authService.isLoggedIn() ;
    const isApiUrl = req.url.startsWith(environment.baseApiUrl);
    
    
    if (isLoggedIn && isApiUrl) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `${account?.jwtToken}` 
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req); 
  }
}
