import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from './article-detail/article-detail.component';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  // URL de l'API 
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Méthode privée pour obtenir les en-têtes d'authentification
  private getAuthHeaders(): HttpHeaders {
    // Récupère le token d'authentification du stockage local
    const token = localStorage.getItem('auth_token');
    console.log('Token utilisé pour l\'authentification:', token); 
    // Crée et retourne les en-têtes HTTP avec le token d'authentification
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

    // Récupérer la liste de tous les articles
    getArticles(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/articles`, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError) // Gère les erreurs potentielles
      );
    }

  // Récupérer un article spécifique par son ID
  getArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Créer un nouvel article
  createArticle(article: any): Observable<any> {
    console.log('Article créé:', article); 
    return this.http.post<any>(`${this.apiUrl}/articles`, article, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Mettre à jour un article existant
  updateArticle(id: number, article: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/articles/${id}`, article, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Supprimer un article par son ID
  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/articles/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Récupérer les commentaires d'un article spécifique
  getComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/articles/${articleId}/comments`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Ajouter un commentaire à un article
  addComment(articleId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/articles/${articleId}/comments`, comment, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Supprimer un commentaire par son ID
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError) // Gère les erreurs potentielles
    );
  }

  // Méthode privée pour gérer les erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message); // Affiche l'erreur dans la console
    // Retourne une observable d'erreur
    return throwError('Something went wrong; please try again later.');
  }
}
