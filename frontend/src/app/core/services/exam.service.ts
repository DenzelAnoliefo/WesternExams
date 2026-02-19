import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exam, ExamSearchParams, PageResponse } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  search(params: ExamSearchParams): Observable<PageResponse<Exam>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.faculty) httpParams = httpParams.set('faculty', params.faculty);
    if (params.level) httpParams = httpParams.set('level', params.level.toString());
    if (params.year) httpParams = httpParams.set('year', params.year.toString());
    if (params.term) httpParams = httpParams.set('term', params.term);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size) httpParams = httpParams.set('size', params.size.toString());

    return this.http.get<PageResponse<Exam>>(this.apiUrl, { params: httpParams });
  }

  getExam(id: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  getDownloadUrl(id: string): string {
    return `${this.apiUrl}/${id}/download`;
  }

  uploadExam(metadata: any, file: File): Observable<Exam> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    return this.http.post<Exam>(this.apiUrl, formData);
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
