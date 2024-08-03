import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { CrudService } from '../crud.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  comment: string;
  user: {
    name: string;
  };
}

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  isAuthor: boolean = false; // Variable pour vérifier si l'utilisateur est l'auteur
  comments: Comment[] = [];
  newComment: string = '';
  articleId: number = 0;
  userId: number = 0;
  currentUser: any; // Ajoutez une variable pour stocker les informations de l'utilisateur connecté

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
        this.currentUser = userInfo; // Stocke les informations de l'utilisateur connecté
        this.userId = userInfo.id; // Initialiser l'ID utilisateur

        this.crudService.getArticle(id).subscribe(
          article => {
            this.article = article;
            this.articleId = article.id; // Initialiser l'ID de l'article
            // Vérifiez si l'utilisateur connecté est l'auteur de l'article
            this.isAuthor = article.user_id === userInfo.id;

            // Charger les commentaires de l'article
            this.loadComments(id);
          },
          error => console.error('Erreur lors de la récupération de l\'article:', error)
        );
      },
      error => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error)
    );
  }

  loadComments(articleId: number): void {
    this.crudService.getComments(articleId).subscribe(
      comments => {
        // Assurez-vous que chaque commentaire a un objet `user` avec un nom
        this.comments = comments.map(comment => ({
          ...comment,
          user: comment.user || { name: 'Utilisateur inconnu' } // Valeur par défaut si `user` est undefined
        }));
      },
      error => console.error('Erreur lors de la récupération des commentaires:', error)
    );
  }
  
  
  addComment(): void {
    if (this.newComment.trim()) {
      const commentData = {
        article_id: this.articleId,
        user_id: this.userId,
        comment: this.newComment
      };
      this.crudService.addComment(this.articleId, commentData).subscribe(
        (comment: Comment) => {
          this.comments.push(comment);
          this.newComment = '';
          Swal.fire({
            title: 'Commentaire ajouté!',
            text: 'Votre commentaire a été ajouté avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error => {
          console.error('Erreur lors de l\'ajout du commentaire:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de l\'ajout du commentaire.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      );
    }
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
              this.router.navigate([`/articles`]); // Redirection vers la liste des articles après suppression
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
  deleteComment(commentId: number): void {
    // Vérifiez si l'utilisateur connecté est bien l'auteur du commentaire
    const commentToDelete = this.comments.find(comment => comment.id === commentId);
    
    if (commentToDelete && commentToDelete.user_id === this.userId) {
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
          this.crudService.deleteComment(commentId).subscribe(
            () => {
              this.comments = this.comments.filter(comment => comment.id !== commentId);
              Swal.fire({
                title: 'Supprimé!',
                text: 'Le commentaire a été supprimé.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            (error) => {
              console.error('Erreur lors de la suppression du commentaire:', error);
              Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la suppression du commentaire.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
              });
            }
          );
        }
      });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Vous ne pouvez supprimer que vos propres commentaires.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
  
  
}
