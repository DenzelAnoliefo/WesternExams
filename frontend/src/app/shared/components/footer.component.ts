import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-black border-t border-white/[0.06] py-10">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <div class="flex items-center justify-center gap-2 mb-3">
          <div class="w-7 h-7 bg-western-purple rounded-lg flex items-center justify-center font-bold text-white text-sm">W</div>
          <span class="text-base font-bold text-white">WesternExams</span>
        </div>
        <p class="text-gray-500 text-sm">&copy; 2026 WesternExams. Built for Western University students.</p>
        <p class="mt-1 text-gray-600 text-xs">Not affiliated with Western University.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
