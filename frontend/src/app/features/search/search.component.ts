import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { Exam, ExamSearchParams, PageResponse } from '../../core/models/exam.model';
import { ExamCardComponent } from './components/exam-card.component';
import { FilterSidebarComponent } from './components/filter-sidebar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ExamCardComponent, FilterSidebarComponent],
  template: `
    <div class="pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-4">Browse Exams</h1>
          <div class="relative max-w-xl">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Search by course code or name..."
              class="w-full px-5 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent"
            />
          </div>
        </div>

        <!-- Main layout -->
        <div class="flex gap-8">
          <!-- Sidebar -->
          <div class="w-64 flex-shrink-0 hidden lg:block">
            <app-filter-sidebar (filtersChanged)="onFiltersChanged($event)"></app-filter-sidebar>
          </div>

          <!-- Results -->
          <div class="flex-1">
            @if (loading) {
              <div class="text-center py-12">
                <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full mx-auto"></div>
                <p class="text-gray-400 mt-4">Searching...</p>
              </div>
            } @else if (results && results.content.length > 0) {
              <p class="text-sm text-gray-400 mb-4">
                {{ results.totalElements }} result{{ results.totalElements !== 1 ? 's' : '' }} found
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (exam of results.content; track exam.id) {
                  <app-exam-card [exam]="exam"></app-exam-card>
                }
              </div>

              <!-- Pagination -->
              @if (results.totalPages > 1) {
                <div class="flex items-center justify-center gap-2 mt-8">
                  <button (click)="goToPage(currentPage - 1)"
                          [disabled]="currentPage === 0"
                          class="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-30 hover:bg-gray-700 transition-colors">
                    Previous
                  </button>
                  <span class="text-gray-400 px-4">
                    Page {{ currentPage + 1 }} of {{ results.totalPages }}
                  </span>
                  <button (click)="goToPage(currentPage + 1)"
                          [disabled]="currentPage >= results.totalPages - 1"
                          class="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-30 hover:bg-gray-700 transition-colors">
                    Next
                  </button>
                </div>
              }
            } @else {
              <div class="text-center py-16">
                <div class="text-5xl mb-4">📚</div>
                <h3 class="text-xl font-semibold text-white mb-2">No exams found</h3>
                <p class="text-gray-400">Try adjusting your search or filters.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  results: PageResponse<Exam> | null = null;
  loading = false;
  currentPage = 0;
  private currentFilters: ExamSearchParams = {};

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadExams();
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.router.navigate(['/search'], {
      queryParams: { search: this.searchQuery || undefined }
    });
  }

  onFiltersChanged(filters: ExamSearchParams): void {
    this.currentFilters = filters;
    this.currentPage = 0;
    this.loadExams();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadExams();
  }

  private loadExams(): void {
    this.loading = true;
    const params: ExamSearchParams = {
      ...this.currentFilters,
      search: this.searchQuery || undefined,
      page: this.currentPage,
      size: 20
    };

    this.examService.search(params).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
