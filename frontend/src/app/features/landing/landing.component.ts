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
    .photo-collab {
      background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80');
    }
  `],
  template: `
    <!-- HERO - Photo bg with purple overlay, left-aligned content -->
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

    <!-- FEATURES ROW - Dark purple card on purple bg -->
    <section class="bg-western-purple">
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

    <!-- THREE CARDS - 1 purple, 2 gold. No icons, just title + text, all left-aligned -->
    <section class="bg-western-purple">
      <div class="max-w-6xl mx-auto px-6 pb-20">
        <div class="grid md:grid-cols-3 gap-6">

          <div class="rounded-3xl p-8 bg-western-purple-light">
            <h3 class="text-xl font-bold text-white mb-3">Exam Archive</h3>
            <p class="text-purple-200/70 text-sm leading-relaxed">Browse a growing collection of past exams spanning hundreds of courses across all faculties.</p>
          </div>

          <div class="rounded-3xl p-8 bg-western-gold-bg">
            <h3 class="text-xl font-bold text-western-gold-light mb-3">Community Driven</h3>
            <p class="text-western-gold-muted text-sm leading-relaxed">Built by students, for students. Contribute your exams and help others succeed in their courses.</p>
          </div>

          <div class="rounded-3xl p-8 bg-western-gold-surface">
            <h3 class="text-xl font-bold text-western-gold-light mb-3">100% Free</h3>
            <p class="text-western-gold-muted text-sm leading-relaxed">No subscriptions, no paywalls. Every exam and resource is completely free to access.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- PHOTO CARDS ROW - 2 photos side by side -->
    <section class="bg-western-gold-bg">
      <div class="max-w-6xl mx-auto px-6 py-20">

        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-black text-western-gold-light mb-4">Why Students Love Us</h2>
          <p class="text-western-gold-muted text-lg max-w-xl mx-auto">Everything you need to prepare for your next exam.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">

          <div class="rounded-3xl overflow-hidden relative h-72 shadow-lg">
            <div class="absolute inset-0 photo-card photo-library"></div>
            <div class="absolute inset-0 bg-western-purple-dark/75"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-2xl font-bold text-white mb-2">Smart Search</h3>
              <p class="text-purple-200 leading-relaxed">Search by course code to instantly find the exams you need. Study materials at your fingertips.</p>
            </div>
          </div>

          <div class="rounded-3xl overflow-hidden relative h-72 shadow-lg">
            <div class="absolute inset-0 photo-card photo-study"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/75"></div>
            <div class="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 class="text-2xl font-bold text-western-gold-light mb-2">Growing Every Day</h3>
              <p class="text-western-gold leading-relaxed">Our library is constantly expanding thanks to contributions from students across all faculties.</p>
            </div>
          </div>

        </div>

        <!-- BOTTOM ROW - Search card + Stats card -->
        <div class="grid md:grid-cols-2 gap-6">

          <div class="rounded-3xl overflow-hidden relative shadow-lg">
            <div class="absolute inset-0 photo-card photo-notes"></div>
            <div class="absolute inset-0 bg-western-gold-deeper/85"></div>
            <div class="relative z-10 p-10">
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
          </div>

          <div class="rounded-3xl overflow-hidden relative shadow-lg">
            <div class="absolute inset-0 photo-card photo-campus"></div>
            <div class="absolute inset-0 bg-western-purple-dark/85"></div>
            <div class="relative z-10 p-10">
              <h3 class="text-2xl font-bold text-white mb-3">By The Numbers</h3>
              <p class="text-purple-300/60 leading-relaxed mb-6">A resource that keeps growing.</p>
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
