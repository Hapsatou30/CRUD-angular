import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // URL de base de l'API
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Injection du service HttpClient
  constructor(private http: HttpClient) {}

  // Récupère tous les articles
  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Récupère les articles d'un utilisateur spécifique
  getArticlesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Récupère un article par son ID
  getArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Récupère les commentaires d'un article par l'ID de l'article
  getCommentsByArticle(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${articleId}/comments`).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Crée un nouvel article
  createArticle(article: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, article).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Met à jour un article existant par son ID
  updateArticle(id: number, article: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, article).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Supprime un article par son ID
  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
