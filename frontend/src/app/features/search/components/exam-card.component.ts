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
       class="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-western-purple transition-colors group">

      <div class="flex items-start justify-between mb-3">
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

      <h3 class="text-white font-semibold text-sm mb-2 group-hover:text-purple-300 transition-colors leading-snug">
        {{ exam.courseName }}
      </h3>

      <div class="flex items-center gap-2 text-xs text-gray-400">
        <span>{{ exam.term }} {{ exam.year }}</span>
        
      </div>

    </a>
  `
})
export class ExamCardComponent {
  @Input({ required: true }) exam!: Exam;
}
