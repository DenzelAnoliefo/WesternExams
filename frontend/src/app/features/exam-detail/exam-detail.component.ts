import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExamService } from '../../core/services/exam.service';
import { Exam } from '../../core/models/exam.model';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pt-24 pb-16 min-h-screen">
      <div class="max-w-6xl mx-auto px-6">

        @if (exam) {
          <!-- Back link -->
          <a routerLink="/search"
             class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </a>

          <div class="flex flex-col lg:flex-row gap-6">

            <!-- PDF Viewer -->
            <div class="flex-1 min-w-0">
              <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                @if (pdfUrl) {
                  <iframe
                    [src]="pdfUrl"
                    class="w-full h-[80vh]"
                    title="Exam PDF">
                  </iframe>
                } @else if (pdfError) {
                  <div class="flex flex-col items-center justify-center h-[50vh]">
                    <div class="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p class="text-gray-400 text-sm font-medium mb-1">Could not load PDF preview</p>
                    <a [href]="downloadUrl" target="_blank" rel="noopener noreferrer"
                       class="text-western-purple-light text-sm hover:underline">
                      Download instead
                    </a>
                  </div>
                } @else {
                  <div class="flex flex-col items-center justify-center h-[50vh]">
                    <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full"></div>
                    <p class="text-gray-500 mt-4 text-sm">Loading preview...</p>
                  </div>
                }
              </div>
            </div>

            <!-- Metadata Panel -->
            <div class="lg:w-72 flex-shrink-0">
              <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">

                <!-- Badges -->
                <div class="flex items-center gap-2 mb-4">
                  <span class="bg-western-purple-dark text-purple-300 px-3 py-1 rounded-lg text-sm font-bold">
                    {{ exam.courseCode }}
                  </span>
                  <span class="text-xs px-2.5 py-1 rounded-lg font-semibold"
                        [class]="exam.examType === 'MIDTERM'
                          ? 'bg-blue-950 text-blue-400'
                          : 'bg-amber-950 text-amber-400'">
                    {{ exam.examType }}
                  </span>
                </div>

                <!-- Course name -->
                <h2 class="text-lg font-bold text-white mb-5 leading-snug">{{ exam.courseName }}</h2>

                <!-- Metadata rows -->
                <div class="space-y-3 mb-6">
                  <div>
                    <p class="text-xs text-gray-500">Term</p>
                    <p class="text-sm text-white font-medium">{{ exam.term }} {{ exam.year }}</p>
                  </div>
                  @if (exam.professor) {
                    <div>
                      <p class="text-xs text-gray-500">Professor</p>
                      <p class="text-sm text-white font-medium">{{ exam.professor }}</p>
                    </div>
                  }
                  <div>
                    <p class="text-xs text-gray-500">Uploaded by</p>
                    <p class="text-sm text-white font-medium">{{ exam.uploadedByName }}</p>
                  </div>
                </div>

                <!-- Download button -->
                <a [href]="downloadUrl" target="_blank" rel="noopener noreferrer"
                   class="flex items-center justify-center gap-2 w-full bg-western-purple hover:bg-western-purple-light text-white font-medium py-3 rounded-lg transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </a>

              </div>
            </div>

          </div>

        } @else if (loading) {
          <div class="flex flex-col items-center justify-center py-32">
            <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full"></div>
            <p class="text-gray-500 mt-4 text-sm">Loading exam...</p>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-32">
            <div class="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-1">Exam not found</h3>
            <p class="text-gray-500 text-sm mb-6">This exam may have been removed or the link is invalid.</p>
            <a routerLink="/search"
               class="text-sm text-western-purple-light hover:underline">
              Back to search
            </a>
          </div>
        }

      </div>
    </div>
  `
})
export class ExamDetailComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  downloadUrl = '';
  loading = true;
  pdfError = false;
  private blobUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.downloadUrl = this.examService.getDownloadUrl(id);

    this.examService.getExam(id).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.examService.downloadExamBlob(id).subscribe({
      next: (blob) => {
        this.blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
      },
      error: () => {
        this.pdfError = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }
}
