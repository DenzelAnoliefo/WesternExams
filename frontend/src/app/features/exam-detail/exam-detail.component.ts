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
    <div class="pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (exam) {
          <!-- Back link -->
          <a routerLink="/search" class="text-gray-400 hover:text-white transition-colors mb-6 inline-block">
            &larr; Back to search
          </a>

          <div class="flex flex-col lg:flex-row gap-8">
            <!-- PDF Viewer -->
            <div class="flex-1">
              <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                @if (pdfUrl) {
                  <iframe
                    [src]="pdfUrl"
                    class="w-full h-[80vh]"
                    title="Exam PDF">
                  </iframe>
                } @else {
                  <div class="flex items-center justify-center h-[80vh]">
                    <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full"></div>
                  </div>
                }
              </div>
            </div>

            <!-- Metadata Panel -->
            <div class="lg:w-80 flex-shrink-0">
              <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-20">
                <div class="mb-4">
                  <span class="bg-western-purple/20 text-western-purple-light px-3 py-1 rounded-lg text-sm font-bold">
                    {{ exam.courseCode }}
                  </span>
                  <span class="ml-2 text-xs px-2 py-1 rounded-full font-medium"
                        [class]="exam.examType === 'MIDTERM'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'">
                    {{ exam.examType }}
                  </span>
                </div>

                <h2 class="text-xl font-bold text-white mb-4">{{ exam.courseName }}</h2>

                <dl class="space-y-3 text-sm">
                  <div>
                    <dt class="text-gray-500">Term</dt>
                    <dd class="text-white">{{ exam.term }} {{ exam.year }}</dd>
                  </div>
                  @if (exam.professor) {
                    <div>
                      <dt class="text-gray-500">Professor</dt>
                      <dd class="text-white">{{ exam.professor }}</dd>
                    </div>
                  }
                  <div>
                    <dt class="text-gray-500">Uploaded by</dt>
                    <dd class="text-white">{{ exam.uploadedByName }}</dd>
                  </div>
                </dl>

                <a [href]="downloadUrl" target="_blank" rel="noopener noreferrer"
                   class="mt-6 block w-full text-center bg-western-purple hover:bg-western-purple-light text-white font-medium py-3 rounded-lg transition-colors">
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        } @else if (loading) {
          <div class="text-center py-20">
            <div class="animate-spin w-8 h-8 border-2 border-western-purple border-t-transparent rounded-full mx-auto"></div>
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
      }
    });
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }
}
