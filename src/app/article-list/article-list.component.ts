import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  articleForm: FormGroup;
  isEditMode = false;
  articleId: number | null = null;

  constructor(
    private crudService: CrudService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadArticles();
  }

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

  addArticle(): void {
    if (this.articleForm.valid) {
      if (this.isEditMode && this.articleId !== null) {
        this.crudService.updateArticle(this.articleId, this.articleForm.value).subscribe(
          (updatedArticle) => {
            const index = this.articles.findIndex((a) => a.id === this.articleId);
            if (index !== -1) {
              this.articles[index] = updatedArticle;
            }
            this.resetForm();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
          }
        );
      } else {
        this.crudService.createArticle(this.articleForm.value).subscribe(
          (newArticle) => {
            this.articles.unshift(newArticle);
            this.resetForm();
          },
          (error) => {
            console.error('Erreur lors de la création de l\'article:', error);
          }
        );
      }
    }
  }

  editArticle(article: any): void {
    this.isEditMode = true;
    this.articleId = article.id;
    this.articleForm.patchValue({
      title: article.title,
      body: article.body
    });
  }

  deleteArticle(id: number): void {
    console.log(`Suppression de l'article avec ID: ${id}`); // Debugging
    this.crudService.deleteArticle(id).subscribe(
      () => {
        console.log('Article supprimé'); // Debugging
        this.articles = this.articles.filter(article => article.id !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'article:', error);
      }
    );
  }

  resetForm(): void {
    this.articleForm.reset();
    this.isEditMode = false;
    this.articleId = null;
  }
}
