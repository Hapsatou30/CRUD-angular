import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule,Router ,ActivatedRoute} from '@angular/router';
import { ArticleListComponent } from '../article-list/article-list.component';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule,ArticleListComponent],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css'
})




export class ArticleFormComponent implements OnInit {
    articleForm: FormGroup;
  isEditMode: boolean = false;
  articleId: number | null = null;
  categories: string[] = ['Politique', 'Sport', 'Santé', 'Éducation']; // Liste des catégories

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      user_id: ['', Validators.required],
      image_path: [''],
      categorie: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.articleId = +id;
        this.isEditMode = this.router.url.includes('edit');
        if (this.isEditMode) {
          this.crudService.getArticle(this.articleId).subscribe(
            article => this.articleForm.patchValue(article),
            error => console.error('Erreur lors du chargement de l\'article:', error)
          );
        }
      }
    });
  }

  submitForm(): void {
    if (this.articleForm.valid) {
      if (this.isEditMode && this.articleId !== null) {
        this.crudService.updateArticle(this.articleId, this.articleForm.value).subscribe(
          () => {
            Swal.fire({
              title: 'Article mis à jour!',
              text: 'L\'article a été mis à jour avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate(['/articles']);
          },
          error => {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la mise à jour de l\'article.',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            });
          }
        );
      } else {
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
  }
  resetForm(): void {
    this.articleForm.reset();
    this.isEditMode = false;
    this.articleId = null;
  }

}
