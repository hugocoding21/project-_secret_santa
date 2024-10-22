import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class MembershipHttpClientService extends ApiService {
  constructor(http: HttpClient, protected tokenStorage: TokenStorageService) {
    super(http);
  }

  getMembersOfGroup(id: string): Observable<any> {
    return this.get(`groups/${id}/members`);
  }

  removeMember(groupId: string, UserId: string): Observable<any> {
    return this.delete(`groups/${groupId}/members/${UserId}`);
  }

  addMembers(groupId: string, params: {}): Observable<any> {
    return this.post(`groups/${groupId}/members`, params);
  }
}
