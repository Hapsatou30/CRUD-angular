import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CrudService } from '../crud.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

// Interface pour représenter un commentaire
export interface Comment {
  id: number; // Identifiant unique du commentaire
  article_id: number; // Identifiant de l'article auquel le commentaire est associé
  user_id: number; // Identifiant de l'utilisateur ayant écrit le commentaire
  comment: string; // Contenu du commentaire
  created_at?: string; // Date de création du commentaire
  user: {
    name: string; // Nom de l'utilisateur
    avatar?: string; // URL de l'avatar de l'utilisateur
  };
}

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any; // Stocke les détails de l'article
  isAuthor: boolean = false; // Variable pour vérifier si l'utilisateur est l'auteur de l'article
  comments: Comment[] = []; // Liste des commentaires associés à l'article
  newComment: string = ''; // Contenu du nouveau commentaire à ajouter
  articleId: number = 0; // Identifiant de l'article en cours
  userId: number = 0; // Identifiant de l'utilisateur connecté
  currentUser: any; // Stocke les informations de l'utilisateur connecté
  p: number = 1; // Page actuelle pour la pagination des commentaires

  // Constructeur pour injecter les dépendances
  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!; // Récupère l'identifiant de l'article depuis l'URL
    
    // Récupère les détails de l'utilisateur connecté
    this.authService.getUserDetails().subscribe(
      userInfo => {
        this.currentUser = userInfo; // Stocke les informations de l'utilisateur connecté
        this.userId = userInfo.id; // Récupère l'identifiant de l'utilisateur connecté

        // Récupère les détails de l'article
        this.crudService.getArticle(id).subscribe(
          article => {
            this.article = article; // Stocke les détails de l'article
            this.articleId = article.id; // Stocke l'identifiant de l'article
            this.isAuthor = article.user_id === userInfo.id; // Vérifie si l'utilisateur est l'auteur
            this.loadComments(id); // Charge les commentaires associés à l'article
          },
          error => console.error('Erreur lors de la récupération de l\'article:', error) // Gestion des erreurs lors de la récupération de l'article
        );
      },
      error => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error) // Gestion des erreurs lors de la récupération des informations de l'utilisateur
    );
  }

  // Méthode pour charger les commentaires d'un article
  loadComments(articleId: number): void {
    this.crudService.getComments(articleId).subscribe(
      comments => {
        this.comments = comments.map(comment => ({
          ...comment,
          user: comment.user || { name: 'Utilisateur inconnu' } // Définit un nom d'utilisateur par défaut si absent
        }));
      },
      error => console.error('Erreur lors de la récupération des commentaires:', error) // Gestion des erreurs lors de la récupération des commentaires
    );
  }

  // Méthode pour ajouter un nouveau commentaire
  addComment(): void {
    if (this.newComment.trim()) { // Vérifie si le commentaire n'est pas vide
      const commentData = {
        article_id: this.articleId, // Identifiant de l'article
        user_id: this.userId, // Identifiant de l'utilisateur
        comment: this.newComment // Contenu du commentaire
      };
      this.crudService.addComment(this.articleId, commentData).subscribe(
        (comment: Comment) => {
          this.comments.push(comment); // Ajoute le nouveau commentaire à la liste des commentaires
          this.newComment = ''; // Réinitialise le champ de commentaire
          Swal.fire({
            title: 'Commentaire ajouté!',
            text: 'Votre commentaire a été ajouté avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error => {
          console.error('Erreur lors de l\'ajout du commentaire:', error); // Gestion des erreurs lors de l'ajout du commentaire
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

  // Méthode pour éditer un article
  editArticle(id: number): void {
    this.router.navigate(['/articles/edit', id]); // Redirige vers la page d'édition de l'article
  }

  // Méthode pour supprimer un article
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
      if (result.isConfirmed) { // Si l'utilisateur confirme la suppression
        this.crudService.deleteArticle(id).subscribe(
          () => {
            Swal.fire({
              title: 'Supprimé!',
              text: 'L\'article a été supprimé.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([`/articles`]); // Redirige vers la liste des articles après suppression
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'article:', error); // Gestion des erreurs lors de la suppression de l'article
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

  // Méthode pour supprimer un commentaire
  deleteComment(commentId: number): void {
    const commentToDelete = this.comments.find(comment => comment.id === commentId); // Trouve le commentaire à supprimer
    
    if (commentToDelete && commentToDelete.user_id === this.userId) { // Vérifie si l'utilisateur est le propriétaire du commentaire
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
        if (result.isConfirmed) { // Si l'utilisateur confirme la suppression
          this.crudService.deleteComment(commentId).subscribe(
            () => {
              this.comments = this.comments.filter(comment => comment.id !== commentId); // Retire le commentaire supprimé de la liste
              Swal.fire({
                title: 'Supprimé!',
                text: 'Le commentaire a été supprimé.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            (error) => {
              console.error('Erreur lors de la suppression du commentaire:', error); // Gestion des erreurs lors de la suppression du commentaire
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
      // Affiche un message d'erreur si l'utilisateur tente de supprimer un commentaire qui n'est pas le sien
      Swal.fire({
        title: 'Erreur',
        text: 'Vous ne pouvez supprimer que vos propres commentaires.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  // Méthode pour formater la date en chaîne de caractères lisible
  formatDate(date?: string): string {
    if (date) {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options); // Formate la date au format français
    }
    return 'Date inconnue'; // Valeur par défaut si la date est inconnue
  }
}
