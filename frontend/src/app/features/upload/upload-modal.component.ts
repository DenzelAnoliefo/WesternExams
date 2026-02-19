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
      <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg mx-4"
           (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">Upload Exam</h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <!-- Drop zone -->
        <div
          class="border-2 border-dashed rounded-xl p-8 text-center mb-5 transition-colors cursor-pointer"
          [class]="selectedFile ? 'border-western-purple bg-western-purple/10' : 'border-gray-700 hover:border-gray-500'"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          @if (selectedFile) {
            <p class="text-western-purple-light font-medium">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-400 mt-1">{{ (selectedFile.size / 1024 / 1024).toFixed(1) }} MB</p>
          } @else {
            <p class="text-gray-400">Drag & drop a PDF here, or click to browse</p>
            <p class="text-sm text-gray-500 mt-1">PDF only, max 20MB</p>
          }
          <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileSelected($event)" />
        </div>

        <!-- Course code with autocomplete -->
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-400 mb-1">Course Code</label>
          <input
            type="text"
            [(ngModel)]="courseQuery"
            (ngModelChange)="onCourseSearch($event)"
            (focus)="showSuggestions = true"
            placeholder="e.g. CS1027"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-western-purple focus:border-western-purple"
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
          <!-- Term -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Term</label>
            <select [(ngModel)]="term"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
              <option value="FALL">Fall</option>
              <option value="WINTER">Winter</option>
              <option value="SUMMER">Summer</option>
            </select>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Year</label>
            <select [(ngModel)]="year"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
              @for (y of years; track y) {
                <option [ngValue]="y">{{ y }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Professor -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">Professor (optional)</label>
          <input type="text" [(ngModel)]="professor"
                 placeholder="e.g. Dr. Smith"
                 class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
        </div>

        <!-- Exam Type -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">Exam Type</label>
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

        <!-- Submit -->
        <button (click)="onSubmit()"
                [disabled]="!canSubmit() || uploading"
                class="w-full bg-western-purple hover:bg-western-purple-light disabled:opacity-40 text-white font-medium py-3 rounded-lg transition-colors">
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
