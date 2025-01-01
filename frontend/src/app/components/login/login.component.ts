import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;


  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const credentials = { email: this.email, password: this.password };
    this.errorMessage = '';

    const userName = this.email
      .split('@')[0]
      .replace(/[0-9]/g, '')
      .replace('.', ' ') 
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()); 


    this.http.post('http://localhost:3000/api/auth/login', credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', userName);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        this.errorMessage = 'An unexpected error occurred. Please try again';
      },
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
