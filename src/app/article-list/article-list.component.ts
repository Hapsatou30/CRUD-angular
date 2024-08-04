import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule,NgxPaginationModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  // Variables pour stocker le nom de l'utilisateur, la liste des articles,
  // le terme de recherche et les articles filtrés
  userName: string | null = null;
  articles: any[] = [];
  searchTerm: string = '';
  filteredArticles: any[] = [];
  p: number = 1; // Page actuelle pour la pagination

  constructor(
    private crudService: CrudService, 
    private router: Router, 
    private authService: AuthService 
  ) {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    this.loadArticles(); // Charger les articles
    this.getUserDetails(); // Obtenir les détails de l'utilisateur
  }

  // Méthode pour charger les articles depuis le service CRUD
  loadArticles(): void {
    this.crudService.getArticles().subscribe(
      (articles) => {
        this.articles = articles; // Stocker les articles récupérés
        this.filteredArticles = articles; // Initialiser le tableau filtré avec tous les articles
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors de la récupération des articles.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    );
  }

  // Méthode appelée lors de la recherche d'articles
  onSearch(): void {
    const term = this.searchTerm.toLowerCase(); // Convertir le terme de recherche en minuscule
    if (term) {
      // Filtrer les articles par titre ou contenu qui incluent le terme de recherche
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.body.toLowerCase().includes(term)
      );
    } else {
      // Réinitialiser la liste filtrée si le champ de recherche est vide
      this.filteredArticles = this.articles;
    }
  }

  // Méthode pour naviguer vers le formulaire de création d'article
  goToForm(): void {
    this.router.navigate(['/articles/form']);
  }

  // Méthode pour naviguer vers les détails d'un article
  goToDetails(id: number): void {
    this.router.navigate([`/articles/details/${id}`]);
  }

  // Méthode pour obtenir les détails de l'utilisateur connecté
  getUserDetails(): void {
    this.authService.getUserDetails().subscribe(
      (response) => {
        this.userName = response.name; // Stocker le nom de l'utilisateur
      },
      (error) => {
        console.error('Failed to fetch user details', error);
      }
    );
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token'); // Supprimer le token du localStorage
      this.router.navigate(['/login']); // Naviguer vers la page de login
      Swal.fire({
        title: 'Déconnecté',
        text: 'Vous avez été déconnecté avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

  // Méthode pour formater une date en français
  formatDate(dateString: string): string {
    // Définition des options de formatage pour l'objet Date
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', // Afficher l'année avec quatre chiffres (ex : 2023)
      month: 'long', // Afficher le mois en toutes lettres (ex : janvier, février, ...)
      day: 'numeric' // Afficher le jour avec un ou deux chiffres (ex : 1, 15, 30)
    };
    
    // Crée un nouvel objet Date à partir de la chaîne de caractères dateString
    const date = new Date(dateString);
    
    // Utilise la méthode toLocaleDateString pour convertir l'objet Date en chaîne de caractères
    // en utilisant les options de formatage définies précédemment et la locale 'fr-FR' pour le français
    return date.toLocaleDateString('fr-FR', options);
  }
  

  // Méthode pour obtenir un extrait du contenu de l'article
  getExcerpt(body: string): string {
    if (body.length > 100) {
      return body.substring(0, 100) + '...'; // Retourner un extrait limité à 100 caractères
    } else {
      return body; // Retourner le contenu complet si inférieur à 100 caractères
    }
  }
}
