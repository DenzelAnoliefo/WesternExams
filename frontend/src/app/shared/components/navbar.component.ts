import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/[0.06]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">

          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-western-purple rounded-lg flex items-center justify-center">
              <span class="text-base font-black text-white">W</span>
            </div>
            <span class="text-base font-bold text-white hidden sm:inline">WesternExams</span>
          </a>

          <div class="flex items-center gap-2 sm:gap-4">
            <a routerLink="/search" routerLinkActive="text-purple-300"
               class="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1">
              Browse
            </a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/search" [queryParams]="{upload: true}"
                 class="bg-western-purple hover:bg-western-purple-light text-white px-4 py-1.5 rounded-lg transition-colors font-medium text-sm">
                Upload
              </a>
              <button (click)="auth.logout()"
                      class="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1">
                Logout
              </button>
            } @else {
              <a routerLink="/login" routerLinkActive="text-purple-300"
                 class="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1">
                Login
              </a>
              <a routerLink="/register"
                 class="bg-western-purple hover:bg-western-purple-light text-white px-4 py-1.5 rounded-lg transition-colors font-medium text-sm">
                Sign Up
              </a>
            }
          </div>

        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
