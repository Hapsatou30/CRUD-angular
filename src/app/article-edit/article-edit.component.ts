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
  articleForm: FormGroup;
  categories: string[] = ['Politique', 'Sport', 'Santé', 'Éducation'];
  articleId: number = 0;

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      image_path: [''],
      categorie: ['', Validators.required],
      user_id: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.articleId = +this.route.snapshot.paramMap.get('id')!; // Récupérer l'ID de l'article depuis l'URL
    this.loadArticle();
  }

  loadArticle(): void {
    this.crudService.getArticle(this.articleId).subscribe(
      (article) => {
        this.articleForm.patchValue(article);
      },
      (error) => {
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
    if (this.articleForm.valid) {
      this.crudService.updateArticle(this.articleId, this.articleForm.value).subscribe(
        () => {
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
    this.articleForm.reset();
  }
  goBack(): void {
    this.location.back(); // Revenir à la page précédente
  }

}
