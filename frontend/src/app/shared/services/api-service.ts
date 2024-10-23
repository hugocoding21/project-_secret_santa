import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

export class ApiService {
  protected readonly apiUrl = environment.baseApiUrl;
  protected userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();

  constructor(protected http: HttpClient) {}

  // Méthodes génériques pour les requêtes
  protected get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  protected post<T>(endpoint: string, data?: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  protected put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  protected delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  protected setUser(user: User | null): void {
    this.userSubject.next(user);
  }

  public getUser(): User | null {
    return this.userSubject.getValue();
  }
}
