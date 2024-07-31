import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = []; // Liste des articles
  articleForm: FormGroup; // Formulaire pour ajouter ou éditer un article
  isEditMode = false; // Indique si le formulaire est en mode édition
  articleId: number | null = null; // ID de l'article en cours d'édition

  constructor(
    private crudService: CrudService, // Service pour gérer les opérations CRUD
    private router: Router, // Service de routage
    private fb: FormBuilder // Service pour la gestion des formulaires réactifs
  ) {
    // Initialisation du formulaire
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadArticles(); // Charger les articles au démarrage
  }

  // Méthode pour charger les articles depuis le service
  loadArticles(): void {
    this.crudService.getArticles().subscribe(
      (articles) => {
        this.articles = articles;
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    );
  }

  // Méthode pour ajouter ou mettre à jour un article
  addArticle(): void {
    if (this.articleForm.valid) {
      if (this.isEditMode && this.articleId !== null) {
        this.crudService.updateArticle(this.articleId, this.articleForm.value).subscribe(
          (updatedArticle) => {
            // Mettre à jour l'article dans la liste
            const index = this.articles.findIndex((a) => a.id === this.articleId);
            if (index !== -1) {
              this.articles[index] = updatedArticle;
            }
            this.resetForm(); // Réinitialiser le formulaire
            Swal.fire({
              title: 'Article mis à jour!',
              text: 'L\'article a été mis à jour avec succès.',
              icon: 'success',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la mise à jour de l\'article.',
              icon: 'error',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          }
        );
      } else {
        this.crudService.createArticle(this.articleForm.value).subscribe(
          (newArticle) => {
            this.articles.unshift(newArticle); // Ajouter le nouvel article au début de la liste
            this.resetForm(); // Réinitialiser le formulaire
            Swal.fire({
              title: 'Article ajouté!',
              text: 'L\'article a été ajouté avec succès.',
              icon: 'success',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Erreur lors de la création de l\'article:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la création de l\'article.',
              icon: 'error',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          }
        );
      }
    }
  }

  // Méthode pour préparer le formulaire pour l'édition d'un article
  editArticle(article: any): void {
    this.isEditMode = true;
    this.articleId = article.id;
    this.articleForm.patchValue({
      title: article.title,
      body: article.body
    });
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
      timer: 3000, // Affiche l'alerte pendant 3 secondes
      showConfirmButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService.deleteArticle(id).subscribe(
          () => {
            // Filtrer l'article supprimé de la liste
            this.articles = this.articles.filter(article => article.id !== id);
            Swal.fire({
              title: 'Supprimé!',
              text: 'L\'article a été supprimé.',
              icon: 'success',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'article:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la suppression de l\'article.',
              icon: 'error',
              timer: 2000, // Affiche l'alerte pendant 2 secondes
              showConfirmButton: false
            });
          }
        );
      }
    });
  }

  // Méthode pour réinitialiser le formulaire et les modes
  resetForm(): void {
    this.articleForm.reset();
    this.isEditMode = false;
    this.articleId = null;
  }
}
