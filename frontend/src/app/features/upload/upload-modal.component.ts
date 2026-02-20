import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
         (click)="close.emit()">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4"
           (click)="$event.stopPropagation()">

        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-white">Upload Exam</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drop zone -->
        <div
          class="border-2 border-dashed rounded-xl p-8 text-center mb-5 transition-colors cursor-pointer"
          [class]="selectedFile ? 'border-western-purple bg-western-purple-dark' : 'border-gray-700 hover:border-gray-600'"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          @if (selectedFile) {
            <p class="text-purple-300 font-medium text-sm">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-400 mt-1">{{ (selectedFile.size / 1024 / 1024).toFixed(1) }} MB</p>
          } @else {
            <div class="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p class="text-gray-400 text-sm">Drag & drop a PDF here, or click to browse</p>
            <p class="text-xs text-gray-600 mt-1">PDF only, max 20MB</p>
          }
          <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileSelected($event)" />
        </div>

        <!-- Course code with autocomplete -->
        <div class="mb-4 relative">
          <label class="block text-xs font-medium text-gray-400 mb-1.5">Course Code</label>
          <input
            type="text"
            [(ngModel)]="courseQuery"
            (ngModelChange)="onCourseSearch($event)"
            (focus)="showSuggestions = true"
            placeholder="e.g. CS1027"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent"
          />
          @if (showSuggestions && courseSuggestions.length > 0) {
            <div class="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 max-h-40 overflow-y-auto">
              @for (course of courseSuggestions; track course.code) {
                <button (click)="selectCourse(course)"
                        class="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                  <span class="font-medium">{{ course.code }}</span>
                  <span class="text-gray-400 ml-2">{{ course.name }}</span>
                </button>
              }
            </div>
          }
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1.5">Term</label>
            <select [(ngModel)]="term"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
              <option value="FALL">Fall</option>
              <option value="WINTER">Winter</option>
              <option value="SUMMER">Summer</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1.5">Year</label>
            <select [(ngModel)]="year"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent">
              @for (y of years; track y) {
                <option [ngValue]="y">{{ y }}</option>
              }
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-400 mb-1.5">Professor (optional)</label>
          <input type="text" [(ngModel)]="professor"
                 placeholder="e.g. Dr. Smith"
                 class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-western-purple focus:border-transparent" />
        </div>

        <div class="mb-6">
          <label class="block text-xs font-medium text-gray-400 mb-2">Exam Type</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="examType" value="MIDTERM" [(ngModel)]="examType"
                     class="accent-western-purple" />
              <span class="text-white text-sm">Midterm</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="examType" value="FINAL" [(ngModel)]="examType"
                     class="accent-western-purple" />
              <span class="text-white text-sm">Final</span>
            </label>
          </div>
        </div>

        <button (click)="onSubmit()"
                [disabled]="!canSubmit() || uploading"
                class="w-full bg-western-purple hover:bg-western-purple-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm">
          {{ uploading ? 'Uploading...' : 'Upload Exam' }}
        </button>

        @if (error) {
          <p class="text-red-400 text-sm mt-3 text-center">{{ error }}</p>
        }
      </div>
    </div>
  `
})
export class UploadModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() uploaded = new EventEmitter<void>();

  selectedFile: File | null = null;
  courseQuery = '';
  courseCode = '';
  term = 'FALL';
  year = new Date().getFullYear();
  professor = '';
  examType = 'MIDTERM';
  uploading = false;
  error = '';
  showSuggestions = false;
  courseSuggestions: Course[] = [];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 10 }, (_, i) => this.currentYear - i);

  private searchSubject = new Subject<string>();

  constructor(
    private examService: ExamService,
    private courseService: CourseService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(query => this.courseService.searchCourses(query))
    ).subscribe(courses => {
      this.courseSuggestions = courses;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    }
  }

  onCourseSearch(query: string): void {
    if (query.length >= 2) {
      this.searchSubject.next(query);
    } else {
      this.courseSuggestions = [];
    }
  }

  selectCourse(course: Course): void {
    this.courseCode = course.code;
    this.courseQuery = course.code;
    this.showSuggestions = false;
    this.courseSuggestions = [];
  }

  canSubmit(): boolean {
    return !!this.selectedFile && !!this.courseCode && !!this.term && !!this.year && !!this.examType;
  }

  onSubmit(): void {
    if (!this.canSubmit() || !this.selectedFile) return;

    this.uploading = true;
    this.error = '';

    const metadata = {
      courseCode: this.courseCode,
      term: this.term,
      year: this.year,
      professor: this.professor || null,
      examType: this.examType
    };

    this.examService.uploadExam(metadata, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.uploaded.emit();
        this.close.emit();
      },
      error: (err) => {
        this.uploading = false;
        this.error = err.error?.message || 'Upload failed. Please try again.';
      }
    });
  }
}
