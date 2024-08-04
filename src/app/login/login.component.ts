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
  registerForm: FormGroup;
  showLogin: boolean = true; // Contrôle l'affichage des formulaires

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation des formulaires
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Méthode pour soumettre le formulaire de connexion
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Utilisateur connecté avec succès', response);
          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            text: 'Vous êtes maintenant connecté.',
            timer: 1000,
            timerProgressBar: true,
            willClose: () => {
              localStorage.setItem('access_token', response.access_token);
              this.router.navigate(['/articles']);
            }
          });
        },
        error => {
          console.error('Échec de la connexion', error);
          Swal.fire({
            icon: 'error',
            title: 'Échec de la connexion',
            text: 'Impossible de se connecter. Veuillez vérifier vos informations de connexion et réessayer.',
            timer: 3000,
            timerProgressBar: true
          });
        }
      );
    }
  }

  // Méthode pour soumettre le formulaire d'inscription
  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Utilisateur enregistré avec succès', response);
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Vous pouvez maintenant vous connecter.',
            timer: 1000,
            timerProgressBar: true,
            willClose: () => {
              // Passer au formulaire de connexion après inscription réussie
              this.showLogin = true; // Assurez-vous que le formulaire de connexion est affiché
              this.loginForm.reset(); // Réinitialiser le formulaire de connexion
              this.registerForm.reset(); // Réinitialiser le formulaire d'inscription
            }
          });
        },
        error => {
          console.error('Échec de l\'inscription', error);
          Swal.fire({
            icon: 'error',
            title: 'Échec de l\'inscription',
            text: 'Impossible de s\'inscrire. Veuillez réessayer.',
            timer: 3000,
            timerProgressBar: true
          });
        }
      );
    }
  }

  // Méthode pour afficher le formulaire de connexion
  showLoginForm(): void {
    this.showLogin = true;
  }

  // Méthode pour afficher le formulaire d'inscription
  showRegisterForm(): void {
    this.showLogin = false;
  }
}
