import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule],
  styles: [`
    .hero-bg {
      background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80');
      background-size: cover;
      background-position: center 30%;
    }
    .hero-overlay {
      background-color: rgba(79, 38, 131, 0.88);
    }
    .photo-card {
      background-size: cover;
      background-position: center;
    }
    .photo-library {
      background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80');
    }
    .photo-study {
      background-image: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80');
    }
    .photo-notes {
      background-image: url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80');
      background-position: center 40%;
    }
    .photo-campus {
      background-image: url('https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80');
    }
  `],
  template: `
    <!-- HERO -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 hero-bg"></div>
      <div class="absolute inset-0 hero-overlay"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-36 w-full">
        <div class="max-w-2xl text-left">
          <div class="mb-5">
            <div class="w-14 h-14 bg-western-purple-dark rounded-2xl flex items-center justify-center border border-western-purple-soft/30">
              <span class="text-3xl font-black text-white">W</span>
            </div>
          </div>

          <h1 class="text-5xl sm:text-7xl font-black text-white mb-5 tracking-tight leading-[1.1]">
            WesternExams
          </h1>

          <p class="text-lg text-purple-200 mb-8 max-w-lg leading-relaxed">
            Your centralized repository for past exams, midterms, and study
            resources. Search, preview, and contribute all in one place.
          </p>

          <button
            (click)="onSearch()"
            class="inline-flex items-center gap-3 px-10 py-4 bg-western-cream text-western-purple-dark font-bold text-lg rounded-full hover:bg-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- FEATURES - Raised card on purple bg -->
    <section class="bg-western-purple">
      <div class="max-w-6xl mx-auto px-6 py-16">
        <div class="bg-western-purple-dark rounded-3xl px-8 py-10 sm:px-14 sm:py-12 border border-western-purple-soft/15">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-1.5 text-sm">Exam Search</h3>
              <p class="text-western-purple-soft text-xs leading-relaxed">Find past exams by course code, professor, or year.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-1.5 text-sm">PDF Preview</h3>
              <p class="text-western-purple-soft text-xs leading-relaxed">Preview exams directly in your browser before downloading.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-1.5 text-sm">Contribute</h3>
              <p class="text-western-purple-soft text-xs leading-relaxed">Upload exams to help fellow students grow the archive.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-1.5 text-sm">Always Available</h3>
              <p class="text-western-purple-soft text-xs leading-relaxed">Access resources 24/7, completely free for all students.</p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- THREE CARDS - 1 purple, 2 gold -->
    <section class="bg-western-purple pb-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-5">

          <div class="rounded-2xl p-7 bg-western-purple-light min-h-[160px] flex flex-col justify-center">
            <h3 class="text-lg font-bold text-white mb-2">Exam Archive</h3>
            <p class="text-purple-200 text-sm leading-relaxed">Browse a growing collection of past exams spanning hundreds of courses across all faculties.</p>
          </div>

          <div class="rounded-2xl p-7 bg-western-gold-bg min-h-[160px] flex flex-col justify-center">
            <h3 class="text-lg font-bold text-western-gold-light mb-2">Community Driven</h3>
            <p class="text-western-gold text-sm leading-relaxed">Built by students, for students. Contribute your exams and help others succeed in their courses.</p>
          </div>

          <div class="rounded-2xl p-7 bg-western-gold-surface min-h-[160px] flex flex-col justify-center">
            <h3 class="text-lg font-bold text-western-gold-light mb-2">100% Free</h3>
            <p class="text-western-gold text-sm leading-relaxed">No subscriptions, no paywalls. Every exam and resource is completely free to access.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- BOTTOM HALF - Gold background -->
    <section class="bg-western-gold-bg">
      <div class="max-w-6xl mx-auto px-6 py-20">

        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-black text-western-gold-light mb-3">Why Students Love Us</h2>
          <p class="text-western-gold text-base max-w-md mx-auto leading-relaxed">Everything you need to prepare for your next exam.</p>
        </div>

        <!-- Photo cards row -->
        <div class="grid md:grid-cols-2 gap-5 mb-5">

          <div class="rounded-2xl overflow-hidden relative h-64">
            <div class="absolute inset-0 photo-card photo-library"></div>
            <div class="absolute inset-0 bg-western-purple-dark/80"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-xl font-bold text-white mb-2">Smart Search</h3>
              <p class="text-purple-200 text-sm leading-relaxed">Search by course code to instantly find the exams you need. Study materials at your fingertips.</p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden relative h-64">
            <div class="absolute inset-0 photo-card photo-study"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/80"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-xl font-bold text-western-gold-light mb-2">Growing Every Day</h3>
              <p class="text-western-gold text-sm leading-relaxed">Our library is constantly expanding thanks to contributions from students across all faculties.</p>
            </div>
          </div>

        </div>

        <!-- Search + Stats row -->
        <div class="grid md:grid-cols-2 gap-5">

          <div class="rounded-2xl overflow-hidden relative">
            <div class="absolute inset-0 photo-card photo-notes"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/90"></div>
            <div class="relative z-10 p-8">
              <h3 class="text-xl font-bold text-western-gold-light mb-2">Find Your Exam</h3>
              <p class="text-western-gold text-sm leading-relaxed mb-5">Enter a course code to get started.</p>
              <div class="flex items-center gap-3">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="onSearch()"
                  placeholder="Try CS1027..."
                  class="flex-1 px-4 py-3 rounded-xl bg-western-gold-bg border border-western-gold-dark text-white placeholder-western-gold-dark focus:outline-none focus:ring-2 focus:ring-western-gold focus:border-transparent transition-all text-sm"
                />
                <button
                  (click)="onSearch()"
                  class="px-6 py-3 bg-western-gold text-western-gold-deeper font-semibold rounded-xl hover:bg-western-gold-light transition-colors text-sm">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden relative">
            <div class="absolute inset-0 photo-card photo-campus"></div>
            <div class="absolute inset-0 bg-western-purple-dark/90"></div>
            <div class="relative z-10 p-8">
              <h3 class="text-xl font-bold text-white mb-2">By The Numbers</h3>
              <p class="text-western-purple-soft text-sm leading-relaxed mb-5">A resource that keeps growing.</p>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 rounded-xl bg-western-purple border border-western-purple-soft/15">
                  <div class="text-xl font-black text-white">250+</div>
                  <div class="text-xs text-western-purple-soft mt-0.5">Courses</div>
                </div>
                <div class="text-center p-3 rounded-xl bg-western-purple border border-western-purple-soft/15">
                  <div class="text-xl font-black text-white">1</div>
                  <div class="text-xs text-western-purple-soft mt-0.5">Institution</div>
                </div>
                <div class="text-center p-3 rounded-xl bg-western-purple border border-western-purple-soft/15">
                  <div class="text-xl font-black text-white">New</div>
                  <div class="text-xs text-western-purple-soft mt-0.5">Exams</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class LandingComponent {
  searchQuery = '';

  constructor(private router: Router, private auth: AuthService) {}

  onSearch(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { search: this.searchQuery.trim() }
      });
    } else {
      this.router.navigate(['/search']);
    }
  }
}
