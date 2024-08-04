
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
  userName: string | null = null; 
  articles: any[] = []; 

  constructor(
    private crudService: CrudService, 
    private router: Router, 
    private authService: AuthService 
  ) {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    this.loadArticles();
    this.getUserDetails(); 
  }

  // Méthode pour charger les articles depuis le service CRUD
  loadArticles(): void {
    this.crudService.getArticles().subscribe(
      (articles) => {
        this.articles = articles; // Stocker les articles récupérés dans la variable
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

  // Méthode pour naviguer vers le formulaire de création d'article
  goToForm(): void {
    this.router.navigate(['/articles/form']);
  }

  // Méthode pour naviguer vers les détails d'un article
  goToDetails(id: number): void {
    this.router.navigate([`/articles/details/${id}`]);
  }

  // Méthode pour récupérer les détails de l'utilisateur connecté
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
 // Formatage de la date de création
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
