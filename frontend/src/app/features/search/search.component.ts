import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ExamService } from '../../core/services/exam.service';
import { Exam, ExamSearchParams, PageResponse } from '../../core/models/exam.model';
import { ExamCardComponent } from './components/exam-card.component';
import { FilterSidebarComponent } from './components/filter-sidebar.component';
import { UploadModalComponent } from '../upload/upload-modal.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ExamCardComponent, FilterSidebarComponent, UploadModalComponent],
  template: `
    <div class="pt-24 pb-16 min-h-screen">
      <div class="max-w-6xl mx-auto px-6">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-3xl font-black text-white mb-1">Browse Exams</h1>
          <p class="text-gray-400 text-sm mb-6">Search past exams by course code, name, or professor.</p>
          <div class="relative max-w-xl">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchInput($event)"
              (keyup.enter)="onSearch()"
              placeholder="Search by course code or name..."
              class="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent transition-all"
            />
          </div>
        </div>

        <!-- Main layout -->
        <div class="flex gap-8">

          <!-- Sidebar -->
          <div class="w-56 flex-shrink-0 hidden lg:block">
            <app-filter-sidebar (filtersChanged)="onFiltersChanged($event)"></app-filter-sidebar>
          </div>

          <!-- Results -->
          <div class="flex-1 min-w-0">
            @if (loading) {
              <div class="flex flex-col items-center justify-center py-20">
                <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full"></div>
                <p class="text-gray-500 mt-4 text-sm">Searching...</p>
              </div>
            } @else if (results && results.content.length > 0) {
              <p class="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                {{ results.totalElements }} result{{ results.totalElements !== 1 ? 's' : '' }} found
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (exam of results.content; track exam.id) {
                  <app-exam-card [exam]="exam"></app-exam-card>
                }
              </div>

              <!-- Pagination -->
              @if (results.totalPages > 1) {
                <div class="flex items-center justify-center gap-3 mt-10">
                  <button (click)="goToPage(currentPage - 1)"
                          [disabled]="currentPage === 0"
                          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-700 transition-colors">
                    Previous
                  </button>
                  <span class="text-gray-500 text-sm px-2">
                    {{ currentPage + 1 }} / {{ results.totalPages }}
                  </span>
                  <button (click)="goToPage(currentPage + 1)"
                          [disabled]="currentPage >= results.totalPages - 1"
                          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-700 transition-colors">
                    Next
                  </button>
                </div>
              }
            } @else if (hasSearched) {
              <div class="flex flex-col items-center justify-center py-20">
                <div class="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">No exams found</h3>
                <p class="text-gray-500 text-sm">Try adjusting your search or filters.</p>
              </div>
            } @else {
              <div class="flex flex-col items-center justify-center py-20">
                <div class="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">No exams uploaded yet</h3>
                <p class="text-gray-500 text-sm">Be the first to contribute! Upload an exam to get started.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    @if (showUploadModal) {
      <app-upload-modal (close)="closeUploadModal()" (uploaded)="onUploaded()"></app-upload-modal>
    }
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  results: PageResponse<Exam> | null = null;
  loading = false;
  currentPage = 0;
  showUploadModal = false;
  hasSearched = false;
  private currentFilters: ExamSearchParams = {};
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.hasSearched = query.length > 0;
      this.loadExams();
    });

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.hasSearched = true;
      }
      if (params['upload'] === 'true' && this.auth.isAuthenticated()) {
        this.showUploadModal = true;
      }
      this.loadExams();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchInput(query: string): void {
    this.searchSubject.next(query);
  }

  onSearch(): void {
    this.currentPage = 0;
    this.hasSearched = true;
    this.loadExams();
  }

  onFiltersChanged(filters: ExamSearchParams): void {
    this.currentFilters = filters;
    this.currentPage = 0;
    this.hasSearched = true;
    this.loadExams();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadExams();
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.router.navigate(['/search'], {
      queryParams: { search: this.searchQuery || undefined }
    });
  }

  onUploaded(): void {
    this.closeUploadModal();
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
      error: (err) => {
        console.error('Failed to load exams:', err);
        this.loading = false;
      }
    });
  }
}
