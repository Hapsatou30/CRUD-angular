import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

export const routes: Routes = [
    { path: '', component: ArticleListComponent },
  { path: 'add', component: ArticleFormComponent },
  { path: 'edit/:id', component: ArticleFormComponent },
  { path: 'details/:id', component: ArticleDetailComponent }
];
