import { Routes } from '@angular/router';
import { SeoData } from './core/services/seo.service';

/** Route `data.seo` is consumed by AppComponent on each NavigationEnd. */
type SeoRouteData = { seo: SeoData };

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    data: {
      seo: {
        title: 'WesternExams — Past Exams & Midterms for Western University Courses',
        description:
          'Free archive of past exams, midterms, and finals for Western ' +
          'University (UWO) courses. Search by course code, preview exam PDFs, ' +
          'and contribute your own.',
        canonicalPath: '/'
      }
    } satisfies SeoRouteData
  },
  {
    path: 'search',
    // Public: the backend already serves exam metadata unauthenticated, and
    // crawlers must reach this page for course-level queries to ever rank.
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
    data: {
      seo: {
        title: 'Search Past Exams by Course Code | WesternExams',
        description:
          'Search the WesternExams archive for past exams, midterms, and finals ' +
          'by Western University course code, professor, or year.',
        canonicalPath: '/search'
      }
    } satisfies SeoRouteData
  },
  {
    path: 'exams/:id',
    // Public. Auth is enforced on the download action instead, so a visitor
    // can see the exam before being asked to sign up.
    loadComponent: () => import('./features/exam-detail/exam-detail.component').then(m => m.ExamDetailComponent)
    // No static seo data: the component sets title and description from the
    // loaded exam, since they depend on the course code and term.
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    data: {
      seo: {
        title: 'Sign In | WesternExams',
        // noindex evicts the already-indexed /login URL. robots.txt alone
        // cannot: a blocked page that is already indexed is never recrawled,
        // so the directive would never be seen.
        noindex: true
      }
    } satisfies SeoRouteData
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    data: {
      seo: {
        title: 'Create an Account | WesternExams',
        noindex: true
      }
    } satisfies SeoRouteData
  },
  {
    path: '**',
    redirectTo: ''
  }
];
