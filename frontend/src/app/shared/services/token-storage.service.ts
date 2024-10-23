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
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  clear(): void {
    window.localStorage.clear();
  }

  public saveRefreshToken(token: string): void {
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
    window.localStorage.setItem(USER_KEY, JSON.stringify(cloneUser));
  }

  getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);

    // Ajout d'une vérification avant d'appeler JSON.parse
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }

  public getToken(): any {
    return localStorage.getItem(TOKEN_KEY) ?? '';
  }

  get(name: string) {
    return localStorage.getItem(name);
  }

  set(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  getUserId(): string | null {
    const user = JSON.parse(localStorage.getItem('userId') || 'null');
    return user ? user.id : null;
  }
}
