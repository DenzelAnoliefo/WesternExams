import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-western-purple rounded-lg flex items-center justify-center font-bold text-white text-lg">W</div>
            <span class="text-xl font-bold text-white">WesternExams</span>
          </a>

          <div class="flex items-center gap-4">
            <a routerLink="/search" routerLinkActive="text-western-purple-light"
               class="text-gray-300 hover:text-white transition-colors">
              Browse
            </a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/search" [queryParams]="{upload: true}"
                 class="bg-western-purple hover:bg-western-purple-light text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                Upload
              </a>
              <button (click)="auth.logout()"
                      class="text-gray-300 hover:text-white transition-colors">
                Logout
              </button>
            } @else {
              <a routerLink="/login" routerLinkActive="text-western-purple-light"
                 class="text-gray-300 hover:text-white transition-colors">
                Login
              </a>
              <a routerLink="/register"
                 class="bg-western-purple hover:bg-western-purple-light text-white px-4 py-2 rounded-lg transition-colors font-medium">
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
