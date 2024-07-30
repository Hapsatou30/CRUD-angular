import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; // Importation de HttpClient pour effectuer des requêtes HTTP
import { Observable } from 'rxjs'; // Importation d'Observable pour gérer les réponses asynchrones

@Injectable({
  providedIn: 'root' // Déclaration du service comme étant disponible dans toute l'application
})
export class CrudService {

  // URL de l'API JSONPlaceholder pour les articles
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Injection du HttpClient dans le constructeur pour effectuer des requêtes HTTP
  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les articles
  // Retourne un Observable contenant un tableau d'articles
  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Effectue une requête GET pour obtenir tous les articles
  }

  // Méthode pour récupérer un article spécifique par son identifiant
  // Retourne un Observable contenant un article
  getArticle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Effectue une requête GET pour obtenir un article par son ID
  }

  // Méthode pour créer un nouvel article
  // Prend en paramètre un objet article et retourne un Observable contenant l'article créé
  createArticle(article: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, article); // Effectue une requête POST pour créer un nouvel article
  }

  // Méthode pour mettre à jour un article existant
  // Prend en paramètre l'ID de l'article et l'objet article mis à jour, retourne un Observable contenant l'article mis à jour
  updateArticle(id: number, article: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, article); // Effectue une requête PUT pour mettre à jour l'article avec l'ID spécifié
  }

  // Méthode pour supprimer un article
  // Prend en paramètre l'ID de l'article à supprimer et retourne un Observable de la réponse de la suppression
  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`); // Effectue une requête DELETE pour supprimer l'article avec l'ID spécifié
  }
}
