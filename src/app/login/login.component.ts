import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../auth.service'; 
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login', 
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  loginForm: FormGroup; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Création du formulaire réactif avec les contrôles email et mot de passe
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required] 
    });
  }

  onSubmit(): void {
    // Méthode appelée lors de la soumission du formulaire
    if (this.loginForm.valid) { // Vérifie si le formulaire est valide
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          // Appelle le service d'authentification pour se connecter
          console.log('Utilisateur connecté avec succès', response); 
          
          // Affiche une alerte de succès avec SweetAlert2
          Swal.fire({
            icon: 'success', 
            title: 'Connexion réussie', 
            text: 'Vous êtes maintenant connecté.', 
            timer: 3000, 
            timerProgressBar: true, 
            willClose: () => {
              // Code à exécuter lorsque l'alerte se ferme
              localStorage.setItem('access_token', response.access_token); // Stocke le token d'accès dans le stockage local
              this.router.navigate(['/articles']); // Redirige l'utilisateur vers la page des articles après la fermeture de l'alerte
            }
          });
        },
        error => {
          console.error('Échec de la connexion', error); 
          
          // Affiche une alerte d'erreur avec SweetAlert2
          Swal.fire({
            icon: 'error', 
            title: 'Échec de la connexion', 
            text: 'Impossible de se connecter. Veuillez vérifier vos informations de connexion et réessayer.', 
            timer: 5000, 
            timerProgressBar: true 
          });
        }
      );
    }
  }
}
