import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api-service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {

    constructor(http: HttpClient, private tokenStorage: TokenStorageService) {
      super(http);
    }

  getUserProfile(id:number): Observable<User> {
    return this.get<User>(`users/${id}`);
  }

  updateUserProfile(user: User): Observable<void> {
    this.setUser(user);    
    this.tokenStorage.saveUser(user);
    return this.put<void>(`users/${user.id}`, user);
  }

  changePassword(user: User,data: { oldPassword: string; newPassword: string}): Observable<any> {

    return this.put(`users/${user.id}/change-password`, data);
  }
}
