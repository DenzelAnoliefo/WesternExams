import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExamService } from '../../core/services/exam.service';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
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
                    <button type="button" (click)="onDownload()"
                            class="text-western-purple-light text-sm hover:underline">
                      Download instead
                    </button>
                  </div>
                } @else {
                  <div class="flex flex-col items-center justify-center h-[50vh]">
                    <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full"></div>
                    <p class="text-gray-500 mt-4 text-sm">Loading preview...</p>
                  </div>
                }
              </div>

              @if (pdfUrl && !isAuthenticated()) {
                <p class="text-center text-sm text-gray-500 mt-3">
                  Showing the first page. Sign in free to read the full exam.
                </p>
              }
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
                </div>

                <!-- Download button. Signed-out visitors are sent to login and
                     returned here afterwards, so the prompt lands after they
                     have already seen the exam. -->
                <button type="button" (click)="onDownload()"
                        class="flex items-center justify-center gap-2 w-full bg-western-purple hover:bg-western-purple-light text-white font-medium py-3 rounded-lg transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {{ isAuthenticated() ? 'Download PDF' : 'Sign in to download' }}
                </button>

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
  private examId = '';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private sanitizer: DomSanitizer
  ) {}

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Signed-out visitors are routed to login with a return path rather than
   * hitting the download directly, so they come back to this exam afterwards.
   */
  onDownload(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: `/exams/${this.examId}` }
      });
      return;
    }

    // /download is authenticated, so it has to go through HttpClient to pick
    // up the auth interceptor's token. A plain window.open would send no
    // Authorization header and come back 401.
    this.examService.downloadExamBlob(this.examId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.exam?.courseCode ?? 'exam'}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.examId = id;
    this.downloadUrl = this.examService.getDownloadUrl(id);

    this.examService.getExam(id).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.loading = false;
        this.applySeo(exam);
      },
      error: () => {
        this.loading = false;
        // Without this the page keeps the previously viewed exam's title and
        // canonical, pointing a broken page at an unrelated URL.
        this.seo.update({
          title: 'Exam Not Found | WesternExams',
          description: 'This exam may have been removed or the link is invalid.',
          canonicalPath: `/exams/${this.examId}`,
          noindex: true
        });
      }
    });

    // Signed-in users get the whole PDF inline; everyone else gets the public
    // single-page preview, which is what keeps the page useful to a visitor
    // arriving from search.
    const pdf$ = this.auth.isAuthenticated()
      ? this.examService.downloadExamBlob(id)
      : this.examService.previewExamBlob(id);

    pdf$.subscribe({
      next: (blob) => {
        this.blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
      },
      error: () => {
        this.pdfError = true;
      }
    });
  }

  /**
   * Title and description are built from the exam itself so each page targets
   * its own course-level queries, e.g. "cs2214 midterm fall 2024".
   */
  private applySeo(exam: Exam): void {
    const type = exam.examType === 'MIDTERM' ? 'Midterm' : 'Final Exam';
    // term arrives as an enum ('FALL'), which would otherwise shout mid-title.
    const season = exam.term
      ? exam.term.charAt(0) + exam.term.slice(1).toLowerCase()
      : '';
    const term = [season, exam.year].filter(Boolean).join(' ');
    const title = `${exam.courseCode} ${type} ${term} | WesternExams`.replace(/\s+/g, ' ');

    const professor = exam.professor ? ` Professor ${exam.professor}.` : '';
    const description =
      `${exam.courseCode} ${exam.courseName} ${type.toLowerCase()} from ${term} ` +
      `at Western University (UWO).${professor} Preview the exam PDF free on WesternExams.`;

    this.seo.update({
      title,
      description: description.replace(/\s+/g, ' ').trim(),
      canonicalPath: `/exams/${this.examId}`
    });
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }
}
