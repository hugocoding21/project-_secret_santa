import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export class ApiService {
  protected readonly apiUrl = environment.baseApiUrl;

  constructor(protected http: HttpClient) {}

  // Méthodes génériques pour les requêtes
  protected get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  protected post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  protected put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  protected delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
