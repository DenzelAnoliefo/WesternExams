import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-black py-12">
      <div class="max-w-6xl mx-auto px-6">

        <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-10">

          <!-- Brand -->
          <div class="flex flex-col items-center sm:items-start gap-3">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-western-purple rounded-lg flex items-center justify-center">
                <span class="text-base font-black text-white">W</span>
              </div>
              <span class="text-base font-bold text-white">WesternExams</span>
            </a>
            <p class="text-gray-500 text-sm max-w-xs text-center sm:text-left">
              Your centralized repository for past exams, midterms, and study resources.
            </p>
          </div>

          <!-- Links -->
          <div class="flex gap-10 text-sm">
            <div class="flex flex-col gap-2">
              <span class="text-gray-400 font-semibold mb-1">Navigate</span>
              <a routerLink="/search" class="text-gray-500 hover:text-white transition-colors">Browse Exams</a>
              <a routerLink="/login" class="text-gray-500 hover:text-white transition-colors">Login</a>
              <a routerLink="/register" class="text-gray-500 hover:text-white transition-colors">Sign Up</a>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-gray-400 font-semibold mb-1">About</span>
              <span class="text-gray-500">Built for Western U</span>
              <span class="text-gray-500">Open Source</span>
              <span class="text-gray-500">100% Free</span>
            </div>
          </div>

        </div>

        <!-- Divider + copyright -->
        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-gray-600 text-xs">&copy; 2026 WesternExams. Built for Western University students.</p>
          <p class="text-gray-700 text-xs">Not affiliated with Western University.</p>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {}
