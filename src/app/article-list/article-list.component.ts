import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,FormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  userName: string | null = null;
  articles: any[] = [];
  searchTerm: string = '';
  filteredArticles: any[] = [];

  constructor(
    private crudService: CrudService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.getUserDetails();
  }

  loadArticles(): void {
    this.crudService.getArticles().subscribe(
      (articles) => {
        this.articles = articles;
        this.filteredArticles = articles; // Initialisation du tableau filtré
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

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.body.toLowerCase().includes(term)
      );
    } else {
      this.filteredArticles = this.articles; // Réinitialiser si le champ est vide
    }
  }

  goToForm(): void {
    this.router.navigate(['/articles/form']);
  }

  goToDetails(id: number): void {
    this.router.navigate([`/articles/details/${id}`]);
  }

  getUserDetails(): void {
    this.authService.getUserDetails().subscribe(
      (response) => {
        this.userName = response.name;
      },
      (error) => {
        console.error('Failed to fetch user details', error);
      }
    );
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'Déconnecté',
        text: 'Vous avez été déconnecté avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  getExcerpt(body: string): string {
    if (body.length > 100) {
      return body.substring(0, 100) + '...';
    } else {
      return body;
    }
  }
}
