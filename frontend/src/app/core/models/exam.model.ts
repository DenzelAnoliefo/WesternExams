export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  term: 'FALL' | 'WINTER' | 'SUMMER';
  year: number;
  professor: string;
  examType: 'MIDTERM' | 'FINAL';
  uploadedByName: string;
  createdAt: string;
}

export interface ExamSearchParams {
  search?: string;
  faculty?: string;
  level?: number;
  year?: number;
  term?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
