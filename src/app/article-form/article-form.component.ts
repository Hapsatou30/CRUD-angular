import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../crud.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  // Déclaration du formulaire réactif
  articleForm: FormGroup;

  // Liste des catégories d'articles
  categories: string[] = ['Politique', 'Sport', 'Santé', 'Éducation', 'Mode', 'Autres'];

  // ID de l'utilisateur (initialisé à null)
  userId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private crudService: CrudService, 
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec les contrôles et leurs validations
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]], 
      body: ['', [Validators.required, Validators.minLength(10)]], 
      image_path: [''], // Chemin de l'image (optionnel)
      categorie: ['', Validators.required], 
      user_id: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    // Méthode appelée lors de l'initialisation du composant
    // Récupération des détails de l'utilisateur connecté
    this.authService.getUserDetails().subscribe(
      userInfo => {
        // Mise à jour de l'ID utilisateur dans le formulaire
        this.userId = userInfo.id;
        this.articleForm.get('user_id')?.setValue(this.userId);
        //Le ?. est l'opérateur de navigation sécurisée qui garantit que setValue est appelé uniquement si get('user_id') retourne un contrôle valide.
      },
      error => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error)
    );
  }

  submitForm(): void {
    // Méthode appelée lors de la soumission du formulaire
    if (this.articleForm.valid) { // Vérifie si le formulaire est valide
      this.crudService.createArticle(this.articleForm.value).subscribe(
        () => {
          // Affichage d'une alerte de succès avec SweetAlert2
          Swal.fire({
            title: 'Article ajouté!',
            text: 'L\'article a été ajouté avec succès.',
            icon: 'success',
            timer: 2000, 
            showConfirmButton: false 
          });
          // Redirection vers la liste des articles après la création
          this.router.navigate(['/articles']);
        },
        error => {
          // Affichage d'une alerte d'erreur avec SweetAlert2
          console.error('Erreur lors de la création de l\'article:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la création de l\'article.',
            icon: 'error',
            timer: 2000, 
            showConfirmButton: false 
          });
        }
      );
    }
  }

  resetForm(): void {
    // Méthode pour réinitialiser le formulaire
    this.articleForm.reset();
  }
}
