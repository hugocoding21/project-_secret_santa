import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { TokenStorageService } from './token-storage.service';
import { Group } from 'src/models/api/group/groups.model';

@Injectable({
  providedIn: 'root',
})
export class GroupHttpClientService extends ApiService {
  constructor(http: HttpClient, protected tokenStorage: TokenStorageService) {
    super(http);
  }

  getAllGroups(): Observable<any> {
    return this.get('groups');
  }

  geOwnerGroup(): Observable<any> {
    return this.get('groups/owner');
  }

  getUserGroup(): Observable<any> {
    return this.get('groups/member');
  }

  createGroup(body: any): Observable<any> {
    return this.post('groups', body);
  }

  getGroupById(id: string): Observable<any> {
    return this.get(`groups/${id}`);
  }

  updateGroup(id: string, body: Group): Observable<any> {
    return this.put(`groups/${id}`, body);
  }

  sendEmailInvitation(body: any): Observable<any> {
    return this.post('invite', body);
  }

  deleteGroup(id: string): Observable<any> {
    return this.delete(`groups/${id}`);
  }
}
