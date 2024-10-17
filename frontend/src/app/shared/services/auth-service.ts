import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {

  constructor(http: HttpClient,protected tokenStorage: TokenStorageService) {
    super(http);
  }

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.post('register', userData);
  }

  login(userData: { email: string; password: string }): Observable<any> {
    return this.post('login', userData).pipe(map((user: any) => {
      if (!user) {
        return user;
      }

      // this.langService.setupLanguage(user, appConfig);

      let answer = this.updateToken(user);

      // analytics
      if (answer.jwtToken) {
        console.log('logged in');
      }

      return answer; // token
    }));
  }


  public updateToken(user: any) {
    // Renommer le token JWT
    user.jwtToken = user.token;
    delete user.token;

    if (!user.jwtToken) {
      return user;
    }

    // // Enregistrement dans le BehaviorSubject pour partage entre composants
    // this.objSubject.next(user);

    // // Gestion des rôles
    // user.roles = this.fillUpRoles(user?.roles);

    // Enregistrement du refresh token
    this.saveRefreshToken(user.jwtToken);

    // // Enregistrement de l'utilisateur
    // let redirUrl = user.redirectAuth;
    // delete user.redirectAuth;
    // let storageType = type && type === 'pro' ? 'pro-keys' : 'user-keys';
    // this.tokenStorage.saveUser(user, storageType);

   

  

    // // Envoi de l'utilisateur mis à jour et retour
    // this.objSubject.next(user);
    return user;
}

public saveRefreshToken(refresh_token: string) {
  if (!refresh_token) {
    this.tokenStorage.clear();
  } else {
    this.tokenStorage.saveRefreshToken(refresh_token);
  }
}
}
