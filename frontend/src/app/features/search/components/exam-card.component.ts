import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/exams', exam.id]"
       class="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-western-purple/50 hover:bg-gray-900/80 transition-all group cursor-pointer">
      <div class="flex items-start justify-between mb-3">
        <span class="bg-western-purple/20 text-western-purple-light px-3 py-1 rounded-lg text-sm font-bold">
          {{ exam.courseCode }}
        </span>
        <span class="text-xs px-2 py-1 rounded-full font-medium"
              [class]="exam.examType === 'MIDTERM'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-amber-500/20 text-amber-400'">
          {{ exam.examType }}
        </span>
      </div>

      <h3 class="text-white font-semibold mb-2 group-hover:text-western-purple-light transition-colors">
        {{ exam.courseName }}
      </h3>

      <div class="flex items-center gap-3 text-sm text-gray-400">
        <span>{{ exam.term }} {{ exam.year }}</span>
        @if (exam.professor) {
          <span class="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>{{ exam.professor }}</span>
        }
      </div>

      <div class="mt-3 text-xs text-gray-500">
        Uploaded by {{ exam.uploadedByName }}
      </div>
    </a>
  `
})
export class ExamCardComponent {
  @Input({ required: true }) exam!: Exam;
}
