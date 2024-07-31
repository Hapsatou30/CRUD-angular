import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CrudService } from '../crud.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-article-detail', 
  standalone: true, 
  imports: [CommonModule, RouterModule, HttpClientModule], 
  templateUrl: './article-detail.component.html', 
  styleUrls: ['./article-detail.component.css'] 
})
export class ArticleDetailComponent implements OnInit {
  article: any; // Variable pour stocker les détails de l'article
  comments: any[] = []; // Tableau pour stocker les commentaires de l'article

  constructor(
    private route: ActivatedRoute, // Service pour accéder aux informations sur la route active
    private crudService: CrudService // Service pour effectuer les opérations CRUD
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Récupère l'ID de l'article à partir de la route active
    if (id) {
      // Vérifie si l'ID est défini
      this.crudService.getArticle(Number(id)).subscribe(article => {
        this.article = article; // Stocke les détails de l'article récupéré
      });

      this.crudService.getCommentsByArticle(Number(id)).subscribe(comments => {
        this.comments = comments; // Stocke les commentaires de l'article récupérés
      });
    }
  }
}
