import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  /** Full <title>. Falls back to the site default when omitted. */
  title?: string;
  /** Meta description, ~150-160 chars. */
  description?: string;
  /** Path only, e.g. '/search'. Resolved against the site origin. */
  canonicalPath?: string;
  /** Set true on pages that must not appear in search results. */
  noindex?: boolean;
}

const SITE_ORIGIN = 'https://westernexams.com';

const DEFAULT_TITLE =
  'WesternExams — Past Exams & Midterms for Western University Courses';

const DEFAULT_DESCRIPTION =
  'Free archive of past exams, midterms, and finals for Western University ' +
  '(UWO) courses. Search by course code, preview exam PDFs, and contribute your own.';

/**
 * Keeps per-route SEO tags correct in a single-page app.
 *
 * Without this every route inherits index.html's tags, so auth pages report
 * themselves as canonical to the homepage and cannot be de-indexed.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(data: SeoData): void {
    const title = data.title ?? DEFAULT_TITLE;
    const description = data.description ?? DEFAULT_DESCRIPTION;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph and Twitter mirror the same copy so shared links match.
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (data.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    } else {
      this.meta.updateTag({
        name: 'robots',
        content: 'index, follow, max-image-preview:large'
      });
    }

    // Always rewrite the canonical. Leaving a stale one behind would let a
    // noindex page point at the homepage as its canonical, which risks Google
    // applying that noindex to the homepage instead.
    const path = data.canonicalPath ?? this.currentPath();
    const url = `${SITE_ORIGIN}${path}`;
    this.setCanonical(url);
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  /** Current path without query string or fragment, e.g. '/login'. */
  private currentPath(): string {
    return this.document.location.pathname || '/';
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
