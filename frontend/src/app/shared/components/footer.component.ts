import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-gray-800 bg-gray-950 py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; 2026 WesternExams. Built for Western University students.</p>
        <p class="mt-1">Not affiliated with Western University.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
