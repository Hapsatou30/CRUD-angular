import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'articles', component: ArticleListComponent , canActivate: [AuthGuard]},
  { path: 'details/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // Ajoutez d'autres routes ici
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
