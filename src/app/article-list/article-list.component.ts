import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; 
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  userName: string | null = null; // Variable pour stocker le nom de l'utilisateur
  articles: any[] = []; // Liste des articles

  constructor(
    private crudService: CrudService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArticles(); // Charger les articles au démarrage
    this.getUserDetails();
  }

  loadArticles(): void {
    this.crudService.getArticles().subscribe(
      (articles) => {
        this.articles = articles;
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

 
  

  goToForm(): void {
    this.router.navigate(['/articles/form']);
  }

  goToDetails(id: number): void {
    this.router.navigate([`/articles/details/${id}`]);
  }

 

  getUserDetails(): void {
    this.authService.getUserDetails().subscribe(response => {
      this.userName = response.name;
    }, error => {
      console.error('Failed to fetch user details', error);
    });
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

  handleArticleUpdate(updatedArticle: any): void {
    const index = this.articles.findIndex(article => article.id === updatedArticle.id);
    if (index !== -1) {
      this.articles[index] = updatedArticle;
    } else {
      this.articles.push(updatedArticle);
    }
  }
}
