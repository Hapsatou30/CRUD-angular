import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { CrudService } from '../crud.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'; 
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule,RouterModule, HttpClientModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  isAuthor: boolean = false; // Variable pour vérifier si l'utilisateur est l'auteur

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.authService.getUserDetails().subscribe(
      userInfo => {
        this.crudService.getArticle(id).subscribe(
          article => {
            this.article = article;
            // Vérifiez si l'utilisateur connecté est l'auteur de l'article
            this.isAuthor = article.user_id === userInfo.id;
          },
          error => console.error('Erreur lors de la récupération de l\'article:', error)
        );
      },
      error => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error)
    );
  }

  editArticle(id: number): void {
    this.router.navigate(['/articles/edit', id]);
  }
  
  
  deleteArticle(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action ne peut pas être annulée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
      timer: 3000,
      showConfirmButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService.deleteArticle(id).subscribe(
          () => {
            Swal.fire({
              title: 'Supprimé!',
              text: 'L\'article a été supprimé.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([`/articles`]); // Redirection vers la page de détails
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'article:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la suppression de l\'article.',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            });
          }
        );
      }
    });
  }
}

