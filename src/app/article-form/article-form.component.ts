import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../crud.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  categories: string[] = ['Politique', 'Sport', 'Santé', 'Éducation'];
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private authService: AuthService,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      image_path: [''],
      categorie: ['', Validators.required],
      user_id: [{ value: '', disabled: true }] // Champ caché et désactivé
    });
  }

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe(
      userInfo => {
        this.userId = userInfo.id; // Suppose que l'ID utilisateur est dans userInfo.id
        this.articleForm.get('user_id')?.setValue(this.userId);
      },
      error => console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error)
    );
  }

  submitForm(): void {
    if (this.articleForm.valid) {
      this.crudService.createArticle(this.articleForm.value).subscribe(
        () => {
          Swal.fire({
            title: 'Article ajouté!',
            text: 'L\'article a été ajouté avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/articles']);
        },
        error => {
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
    this.articleForm.reset();
  }
}
