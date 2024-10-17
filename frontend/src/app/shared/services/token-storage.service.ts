import { Injectable } from '@angular/core';

const TOKEN_KEY = 'secretSanta-refresh-auth-token';
const USER_KEY = 'secretSanta-auth-user';

/*
localStorage and sessionStorage accomplish the exact same thing and have the same API,
but with sessionStorage the data is persisted only until the window or tab is closed,
while with localStorage the data is persisted until the user manually clears the browser cache or
until your web app clears the data
*/

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}
  
  clear(): void {
    window.localStorage.clear();
  }

  public saveRefreshToken(token: string): void {
    console.log(window.localStorage);
    console.log(localStorage);
    
    
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    
    // clean access from DB
    let cloneUser = JSON.parse(JSON.stringify(user));
    if (cloneUser.jwtToken) delete cloneUser.jwtToken;

    window.localStorage.setItem(USER_KEY, JSON.stringify(cloneUser));
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? '');
  }
}
