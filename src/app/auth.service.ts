import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // URL de votre API Laravel
  private authSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Enregistrer un nouvel utilisateur
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion de l'utilisateur
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        // Stocker le token dans le stockage local
        localStorage.setItem('auth_token', response.access_token);
        this.authSubject.next(response.access_token);
        return response;
      }),
      catchError(this.handleError)
    );
  }
  //details du user connecter
  getUserDetails(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('auth_token')}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Déconnexion de l'utilisateur
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(() => {
        localStorage.removeItem('auth_token');
        this.authSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  // Obtenir le token de l'utilisateur
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleError(error: any): Observable<never> {
    // Gérer les erreurs
    console.error(error);
    throw error;
  }
}
