import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register', 
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register.component.html', 
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  registerForm: FormGroup; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation du formulaire avec FormBuilder
    this.registerForm = this.fb.group({
      name: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required] 
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    // Méthode appelée lors de la soumission du formulaire
    if (this.registerForm.valid) { // Vérifie si le formulaire est valide
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          // Appelle le service d'authentification pour enregistrer l'utilisateur
          console.log('Utilisateur enregistré avec succès', response); 

          // Affiche une alerte de succès avec SweetAlert2
          Swal.fire({
            icon: 'success', 
            title: 'Inscription réussie', 
            text: 'Vous pouvez maintenant vous connecter.', 
            timer: 3000, 
            timerProgressBar: true, 
            willClose: () => {
              // Code à exécuter lorsque l'alerte se ferme
              this.router.navigate(['/login']); // Redirige l'utilisateur vers la page de connexion après la fermeture de l'alerte
            }
          });
        },
        error => {
          console.error('Échec de l\'inscription', error); 

          Swal.fire({
            icon: 'error', 
            title: 'Échec de l\'inscription',
            text: 'Impossible de s\'inscrire. Veuillez réessayer.', 
            timer: 5000, 
            timerProgressBar: true 
          });
        }
      );
    }
  }
}
