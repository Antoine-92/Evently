import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    const userDetails = { email: this.email, password: this.password };
    this.errorMessage = '';

    this.http.post('http://localhost:3000/api/auth/register', userDetails).subscribe({
      next: () => {
        console.log('Sign-up successful');
        this.http.post('http://localhost:3000/api/auth/login', userDetails).subscribe({
          next: (response: any) => {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/events']);
          },
          error: (error) => {
            this.errorMessage = 'An unexpected error occurred. Please try again';
          },
        });
      },
      error: (error) => {
        this.errorMessage =
          error.error && error.error.message
            ? error.error.message
            : 'An unexpected error occurred. Please try again.';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
