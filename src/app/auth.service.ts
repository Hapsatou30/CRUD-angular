import { Injectable } from '@angular/core'; // Importation du décorateur Injectable pour rendre le service injectable
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importation des modules HttpClient et HttpHeaders pour effectuer des requêtes HTTP
import { Observable, BehaviorSubject } from 'rxjs'; // Importation des objets Observable et BehaviorSubject depuis RxJS
import { catchError, map } from 'rxjs/operators'; // Importation des opérateurs RxJS pour transformer et gérer les erreurs

@Injectable({
  providedIn: 'root' // Déclare que ce service est injectable dans toute l'application
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // URL de base pour les requêtes API

  private authSubject = new BehaviorSubject<any>(null); // Création d'un sujet comportemental pour suivre les changements d'état d'authentification
  //Lorsque l'utilisateur se connecte avec succès, le token d'authentification est stocké dans authSubject


  constructor(private http: HttpClient) {} // Injection du service HttpClient dans le constructeur pour effectuer des requêtes HTTP

  // Enregistrer un nouvel utilisateur
  register(user: any): Observable<any> {
    // Envoie une requête POST à l'API pour enregistrer un nouvel utilisateur
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion de l'utilisateur
  login(credentials: any): Observable<any> {
    // Envoie une requête POST à l'API pour connecter l'utilisateur
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        // Enregistre le token d'authentification dans le stockage local
        localStorage.setItem('auth_token', response.access_token);
        // Met à jour le sujet comportemental avec le nouveau token
        this.authSubject.next(response.access_token);
        return response; // Retourne la réponse de l'API
      }),
      catchError(this.handleError) // Gère les erreurs éventuelles
    );
  }

  // Obtenir les détails de l'utilisateur connecté
  getUserDetails(): Observable<any> {
    // Crée des en-têtes HTTP avec le token d'authentification
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    // Envoie une requête GET pour obtenir les détails de l'utilisateur
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Déconnexion de l'utilisateur
  logout(): Observable<any> {
    // Crée des en-têtes HTTP avec le token d'authentification
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    // Envoie une requête POST à l'API pour déconnecter l'utilisateur
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(() => {
        // Supprime le token du stockage local
        localStorage.removeItem('auth_token');
        // Met à jour le sujet comportemental en le réinitialisant
        this.authSubject.next(null);
      }),
      catchError(this.handleError) // Gère les erreurs éventuelles
    );
  }

  // Obtenir le token de l'utilisateur
  getToken(): string | null {
    // Récupère le token du stockage local
    return localStorage.getItem('auth_token');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    // Retourne vrai si le token existe, sinon faux
    return !!this.getToken();
  }

  private handleError(error: any): Observable<never> {
    // Gère les erreurs en les affichant dans la console
    console.error(error);
    throw error; // Relance l'erreur pour que le flux Observable la gère
  }
}
