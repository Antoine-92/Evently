import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.css'],
})

export class ParticipantFormComponent {
  participant = {
    name: '',
    email: '',
  };
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.participant.name || !this.participant.email) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const apiUrl = 'http://localhost:3000/api/participants';
    this.http.post(apiUrl, this.participant).subscribe({
      next: (response) => {
        this.successMessage = 'Participant created successfully!';
        this.participant = { name: '', email: '' }; // Reset form

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/participant']);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to create participant:', error);
        this.errorMessage = 'Failed to create participant. Please try again.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }
}
