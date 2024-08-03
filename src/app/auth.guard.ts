import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour déterminer si la route peut être activée
  canActivate(): boolean {
    // Vérifie si l'utilisateur est authentifié
    if (this.authService.isAuthenticated()) {
      // Si l'utilisateur est authentifié, autoriser l'accès à la route
      return true;
    } else {
      // Affiche une alerte SweetAlert2 si l'utilisateur n'est pas authentifié
      Swal.fire({
        title: 'Non Authentifié',
        text: 'Vous devez vous connecter pour accéder à cette page.',
        icon: 'warning',
        timer: 3000, 
        timerProgressBar: true,
        didClose: () => {
          // Redirige vers la page de connexion après la fermeture de l'alerte
          this.router.navigate(['/login']);
        }
      });
      // Refuser l'accès à la route
      return false;
    }
  }
}
