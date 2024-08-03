import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Comment } from './article-detail/article-detail.component';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    console.log('Token utilisé pour l\'authentification:', token); // Debug
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getArticles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articles`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createArticle(article: any): Observable<any> {
    console.log('Creating article:', article); // Ajoutez un log pour vérifier les données envoyées
    return this.http.post<any>(`${this.apiUrl}/articles`, article, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateArticle(id: number, article: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/articles/${id}`, article, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/articles/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/articles/${articleId}/comments`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addComment(articleId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/articles/${articleId}/comments`, comment, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  
   

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }
}
