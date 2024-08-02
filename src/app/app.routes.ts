import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

export const routes: Routes = [
    { path: '', component: ArticleListComponent },
  { path: 'details/:id', component: ArticleDetailComponent }
];
