import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  // Déclaration du formulaire réactif
  articleForm: FormGroup;
  // Liste des catégories disponibles pour l'article
  categories: string[] = ['Politique', 'Sport', 'Santé', 'Éducation', 'Mode', 'Autres'];
  // ID de l'article à modifier
  articleId: number = 0;

  constructor(
    private fb: FormBuilder, 
    private crudService: CrudService,
    private authService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location // Service pour manipuler l'historique de navigation
  ) {
    // Initialisation du formulaire réactif avec des validations
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]], 
      body: ['', [Validators.required, Validators.minLength(10)]],
      image_path: [''], 
      categorie: ['', Validators.required], 
      user_id: [{ value: '', disabled: true }] 
    });
  }

  ngOnInit(): void {
    // Récupération de l'ID de l'article depuis les paramètres de l'URL
    this.articleId = +this.route.snapshot.paramMap.get('id')!; // Le '!' indique que l'on est sûr que l'ID est présent
    // L'opérateur + est utilisé ici pour convertir la valeur de type chaîne de caractères (string) en un nombre (number)
    // Chargement des données de l'article
    this.loadArticle();
  }

  loadArticle(): void {
    // Méthode pour récupérer les détails de l'article à partir de l'ID
    this.crudService.getArticle(this.articleId).subscribe(
      (article) => {
        // Remplir le formulaire avec les données de l'article
        this.articleForm.patchValue(article);
      },
      (error) => {
        // Gestion des erreurs lors de la récupération de l'article
        console.error('Erreur lors de la récupération de l\'article:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors de la récupération de l\'article.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    );
  }

  submitForm(): void {
    // Méthode appelée lors de la soumission du formulaire
    if (this.articleForm.valid) { // Vérifier si le formulaire est valide
      this.crudService.updateArticle(this.articleId, this.articleForm.value).subscribe(
        () => {
          // Afficher une alerte de succès lorsque l'article est modifié avec succès
          Swal.fire({
            title: 'Article modifié!',
            text: 'L\'article a été modifié avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.goBack(); // Retourner à la page précédente après la modification
          });
        },
        (error) => {
          // Gestion des erreurs lors de la mise à jour de l'article
          console.error('Erreur lors de la modification de l\'article:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la modification de l\'article.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      );
    }
  }

  resetForm(): void {
    // Réinitialiser le formulaire
    this.articleForm.reset();
  }

  goBack(): void {
    // Revenir à la page précédente
    this.location.back();
  }
}
