import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamSearchParams } from '../../../core/models/exam.model';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky top-24">
      <h3 class="text-sm font-bold text-white uppercase tracking-wide mb-5">Filters</h3>

      <!-- Year -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-400 mb-1.5">Year</label>
        <select [(ngModel)]="filters.year" (ngModelChange)="onFilterChange()"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
          <option [ngValue]="undefined">All years</option>
          @for (y of years; track y) {
            <option [ngValue]="y">{{ y }}</option>
          }
        </select>
      </div>

      <!-- Term -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-400 mb-1.5">Term</label>
        <select [(ngModel)]="filters.term" (ngModelChange)="onFilterChange()"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
          <option [ngValue]="undefined">All terms</option>
          <option value="FALL">Fall</option>
          <option value="WINTER">Winter</option>
          <option value="SUMMER">Summer</option>
        </select>
      </div>

      <!-- Faculty -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-400 mb-1.5">Faculty</label>
        <select [(ngModel)]="filters.faculty" (ngModelChange)="onFilterChange()"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
          <option [ngValue]="undefined">All faculties</option>
          <option value="Science">Science</option>
          <option value="Social Science">Social Science</option>
          <option value="Business">Business</option>
          <option value="Arts and Humanities">Arts & Humanities</option>
          <option value="Engineering">Engineering</option>
        </select>
      </div>

      <!-- Level -->
      <div class="mb-5">
        <label class="block text-xs font-medium text-gray-400 mb-1.5">Level</label>
        <select [(ngModel)]="filters.level" (ngModelChange)="onFilterChange()"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
          <option [ngValue]="undefined">All levels</option>
          <option [ngValue]="1000">1000-level</option>
          <option [ngValue]="2000">2000-level</option>
          <option [ngValue]="3000">3000-level</option>
          <option [ngValue]="4000">4000-level</option>
        </select>
      </div>

      <button (click)="clearFilters()"
              class="w-full text-xs text-gray-500 hover:text-white transition-colors py-2 border border-gray-800 rounded-lg hover:border-gray-700">
        Clear all filters
      </button>
    </aside>
  `
})
export class FilterSidebarComponent {
  @Output() filtersChanged = new EventEmitter<ExamSearchParams>();

  filters: ExamSearchParams = {};
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 10 }, (_, i) => this.currentYear - i);

  onFilterChange(): void {
    this.filtersChanged.emit({ ...this.filters });
  }

  clearFilters(): void {
    this.filters = {};
    this.filtersChanged.emit({});
  }
}
