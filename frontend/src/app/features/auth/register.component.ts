import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 pt-16">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-western-purple rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">W</div>
          <h1 class="text-2xl font-bold text-white">Create an account</h1>
          <p class="text-gray-400 mt-1">Join WesternExams to share and find exams</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required
                   placeholder="John Doe"
                   class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-western-purple focus:border-western-purple" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   placeholder="you@uwo.ca"
                   class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-western-purple focus:border-western-purple" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   placeholder="At least 6 characters"
                   class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-western-purple focus:border-western-purple" />
          </div>

          @if (error) {
            <p class="text-red-400 text-sm text-center">{{ error }}</p>
          }

          <button type="submit" [disabled]="loading"
                  class="w-full bg-western-purple hover:bg-western-purple-light disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-gray-400 text-sm mt-6">
          Already have an account?
          <a routerLink="/login" class="text-western-purple-light hover:underline ml-1">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) return;

    if (!this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
