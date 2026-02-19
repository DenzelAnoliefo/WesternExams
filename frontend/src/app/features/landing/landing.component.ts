import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-western-purple via-western-purple-dark to-gray-950"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,38,131,0.3),transparent_70%)]"></div>

      <!-- Content -->
      <div class="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <!-- Logo -->
        <div class="mb-8 flex items-center justify-center gap-3">
          <div class="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <span class="text-3xl font-bold text-white">W</span>
          </div>
        </div>

        <h1 class="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Welcome to
          <span class="bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
            WesternExams
          </span>
        </h1>

        <p class="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Your centralized repository for past exams, midterms, and study resources.
          Search, preview, and contribute — all in one place.
        </p>

        <!-- Search bar -->
        <div class="flex items-center gap-3 max-w-xl mx-auto">
          <div class="flex-1 relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Search by course code (e.g. CS1027)"
              class="w-full px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-western-purple-light focus:border-transparent transition-all"
            />
          </div>
          <button
            (click)="onSearch()"
            class="px-8 py-4 bg-white text-western-purple font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
            GET STARTED
          </button>
        </div>

        <!-- Stats -->
        <div class="mt-16 flex items-center justify-center gap-12 text-gray-400">
          <div class="text-center">
            <div class="text-2xl font-bold text-white">20+</div>
            <div class="text-sm">Courses</div>
          </div>
          <div class="w-px h-10 bg-gray-700"></div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">100%</div>
            <div class="text-sm">Free</div>
          </div>
          <div class="w-px h-10 bg-gray-700"></div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">PDF</div>
            <div class="text-sm">Preview</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { search: this.searchQuery.trim() }
      });
    } else {
      this.router.navigate(['/search']);
    }
  }
}
