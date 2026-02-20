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
    .texture-purple {
      background-color: #4F2683;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .texture-gold {
      background-color: #3D3320;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4943A' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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
    .photo-collab {
      background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80');
    }
  `],
  template: `
    <!-- HERO SECTION - Purple tone with university photo background -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 hero-bg"></div>
      <div class="absolute inset-0 hero-overlay"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div class="max-w-2xl">
          <div class="mb-8 flex items-center gap-3">
            <div class="w-14 h-14 bg-western-purple-dark rounded-2xl flex items-center justify-center border border-western-purple-soft/30">
              <span class="text-3xl font-black text-white">W</span>
            </div>
          </div>

          <h1 class="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            WesternExams
          </h1>

          <p class="text-lg text-purple-200 mb-10 max-w-lg leading-relaxed">
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

    <!-- FEATURES ROW - Purple textured section -->
    <section class="texture-purple relative z-10">
      <div class="max-w-6xl mx-auto px-6 py-20">
        <div class="bg-western-purple-dark rounded-3xl p-10 sm:p-14 border border-western-purple-soft/15">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 class="text-white font-bold mb-1.5">Exam Search</h3>
              <p class="text-purple-300/50 text-sm leading-relaxed">Find past exams by course code, professor, or year.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 class="text-white font-bold mb-1.5">PDF Preview</h3>
              <p class="text-purple-300/50 text-sm leading-relaxed">Preview exams directly in your browser before downloading.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <h3 class="text-white font-bold mb-1.5">Contribute</h3>
              <p class="text-purple-300/50 text-sm leading-relaxed">Upload exams to help fellow students grow the archive.</p>
            </div>

            <div class="text-center group">
              <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-western-purple flex items-center justify-center border border-western-purple-soft/20 group-hover:bg-western-purple-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-white font-bold mb-1.5">Always Available</h3>
              <p class="text-purple-300/50 text-sm leading-relaxed">Access resources 24/7, completely free for all students.</p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- THREE CARDS ROW - Photo-backed cards -->
    <section class="texture-purple relative pb-0">
      <div class="max-w-6xl mx-auto px-6 pb-20">
        <div class="grid md:grid-cols-3 gap-6">

          <!-- Card 1 - Notes photo -->
          <div class="rounded-3xl overflow-hidden relative h-80 shadow-lg">
            <div class="absolute inset-0 photo-card photo-notes"></div>
            <div class="absolute inset-0 bg-western-purple/80"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <div class="w-12 h-12 rounded-2xl bg-western-purple-dark flex items-center justify-center mb-4 border border-western-purple-soft/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Exam Archive</h3>
              <p class="text-purple-200/80 text-sm leading-relaxed">Browse a growing collection of past exams spanning hundreds of courses across all faculties.</p>
            </div>
          </div>

          <!-- Card 2 - Campus photo (gold) -->
          <div class="rounded-3xl overflow-hidden relative h-80 shadow-lg">
            <div class="absolute inset-0 photo-card photo-campus"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/80"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <div class="w-12 h-12 rounded-2xl bg-western-gold-bg flex items-center justify-center mb-4 border border-western-gold/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-western-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-western-gold-light mb-2">Community Driven</h3>
              <p class="text-western-gold/70 text-sm leading-relaxed">Built by students, for students. Contribute your exams and help others succeed in their courses.</p>
            </div>
          </div>

          <!-- Card 3 - Collab photo (gold) -->
          <div class="rounded-3xl overflow-hidden relative h-80 shadow-lg">
            <div class="absolute inset-0 photo-card photo-collab"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/80"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <div class="w-12 h-12 rounded-2xl bg-western-gold-bg flex items-center justify-center mb-4 border border-western-gold/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-western-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-western-gold-light mb-2">100% Free</h3>
              <p class="text-western-gold/70 text-sm leading-relaxed">No subscriptions, no paywalls. Every exam and resource is completely free to access.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- BOTTOM SECTION - Gold tone with photos and search -->
    <section class="texture-gold relative">
      <div class="max-w-6xl mx-auto px-6 py-20">

        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-black text-western-gold-light mb-4">Why Students Love Us</h2>
          <p class="text-western-gold-muted text-lg max-w-xl mx-auto">Everything you need to prepare for your next exam.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">

          <!-- Photo card - Library -->
          <div class="rounded-3xl overflow-hidden relative h-72 shadow-lg">
            <div class="absolute inset-0 photo-card photo-library"></div>
            <div class="absolute inset-0 bg-western-purple-dark/75"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-2xl font-bold text-white mb-2">Smart Search</h3>
              <p class="text-purple-200/80 leading-relaxed">Search by course code to instantly find the exams you need. Study materials at your fingertips.</p>
            </div>
          </div>

          <!-- Photo card - Campus -->
          <div class="rounded-3xl overflow-hidden relative h-72 shadow-lg">
            <div class="absolute inset-0 photo-card photo-study"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/75"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-2xl font-bold text-western-gold-light mb-2">Growing Every Day</h3>
              <p class="text-western-gold/80 leading-relaxed">Our library is constantly expanding thanks to contributions from students across all faculties.</p>
            </div>
          </div>

        </div>

        <!-- Search + Stats row -->
        <div class="grid md:grid-cols-2 gap-6">

          <!-- Search card -->
          <div class="rounded-3xl p-10 bg-western-gold-surface border border-western-gold/10 shadow-lg">
            <div class="w-14 h-14 rounded-2xl bg-western-gold-bg flex items-center justify-center mb-6 border border-western-gold/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-western-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-western-gold-light mb-3">Find Your Exam</h3>
            <p class="text-western-gold-muted leading-relaxed mb-6">Enter a course code to get started.</p>
            <div class="flex items-center gap-3">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                placeholder="Try CS1027..."
                class="flex-1 px-4 py-3 rounded-xl bg-western-gold-bg border border-western-gold/20 text-white placeholder-western-gold-muted focus:outline-none focus:ring-2 focus:ring-western-gold focus:border-transparent transition-all"
              />
              <button
                (click)="onSearch()"
                class="px-6 py-3 bg-western-gold text-western-gold-deeper font-semibold rounded-xl hover:bg-western-gold-light transition-colors">
                Search
              </button>
            </div>
          </div>

          <!-- Stats card -->
          <div class="rounded-3xl p-10 bg-western-purple-dark border border-western-purple-soft/15 shadow-lg">
            <div class="w-14 h-14 rounded-2xl bg-western-purple flex items-center justify-center mb-6 border border-western-purple-soft/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">By The Numbers</h3>
            <p class="text-purple-300/50 leading-relaxed mb-6">A resource that keeps growing.</p>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 rounded-xl bg-western-purple border border-western-purple-soft/15">
                <div class="text-2xl font-black text-white">250+</div>
                <div class="text-xs text-purple-300/50 mt-1">Courses</div>
              </div>
              <div class="text-center p-4 rounded-xl bg-western-purple border border-western-purple-soft/15">
                <div class="text-2xl font-black text-white">PDF</div>
                <div class="text-xs text-purple-300/50 mt-1">Preview</div>
              </div>
              <div class="text-center p-4 rounded-xl bg-western-purple border border-western-purple-soft/15">
                <div class="text-2xl font-black text-white">Free</div>
                <div class="text-xs text-purple-300/50 mt-1">Always</div>
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
