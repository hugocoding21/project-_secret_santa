import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroupHttpClientService extends ApiService {
  constructor(http: HttpClient, protected tokenStorage: TokenStorageService) {
    super(http);
  }

  getGroups(): Observable<any> {
    return this.get('groups');
  }
}
