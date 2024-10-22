import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from './api-service';
import { TokenStorageService } from './token-storage.service';
import { Group } from 'src/models/api/group/groups.model';

@Injectable({
  providedIn: 'root',
})
export class GroupHttpClientService extends ApiService {
  private isGroupOwnerSubject = new BehaviorSubject<boolean>(false);
  isGroupOwner$ = this.isGroupOwnerSubject.asObservable();

  constructor(http: HttpClient, protected tokenStorage: TokenStorageService) {
    super(http);
  }

  getAllGroups(): Observable<any> {
    return this.get('groups');
  }

  getGroups(owner: boolean = false): Observable<any> {
    const routeName = owner?"owner":"member";
    return this.get(`groups/${routeName}`);
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

  launchSecretSanta(idGroup: string): Observable<any> {
    return this.post(`groups/${idGroup}/secret-santa`);
  }
  deleteSantaAssignement(idGroup: string){
    return this.delete(`groups/${idGroup}/secret-santa`);
  }
  isUserOrOwnerInGroup(idGroup:string, idUser:string){
    return this.get(`groups/${idGroup}/members/${idUser}`)
    .pipe(
      map((response:any) => {
        this.isGroupOwnerSubject.next(response.isOwner);
        return response;
      })
    );;
  }

  showAssociationByMembersId(idGroup:string, idUser:string){
    return this.get(`groups/${idGroup}/secret-santa/${idUser}`);
  }
}
