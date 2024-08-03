import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ArticleEditComponent } from './article-edit/article-edit.component';

const routes: Routes = [
  // Liste des articles (accessible uniquement pour les utilisateurs authentifiés)
  { path: 'articles', component: ArticleListComponent, canActivate: [AuthGuard] },

  // Détails d'un article (accessible uniquement pour les utilisateurs authentifiés)
  { path: 'articles/details/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },

  // Formulaire d'ajout d'un article (accessible uniquement pour les utilisateurs authentifiés)
  { path: 'articles/form', component: ArticleFormComponent, canActivate: [AuthGuard] },

  { path: 'articles/edit/:id', component: ArticleEditComponent, canActivate: [AuthGuard] },
 

  // Inscription
  { path: 'register', component: RegisterComponent },

  // Connexion
  { path: 'login', component: LoginComponent },

  // Redirection vers la page de connexion par défaut
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

// Exportation des routes pour être utilisées ailleurs
export { routes };
