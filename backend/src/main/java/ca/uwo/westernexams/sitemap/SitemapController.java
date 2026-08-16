package ca.uwo.westernexams.sitemap;

import ca.uwo.westernexams.exam.Exam;
import ca.uwo.westernexams.exam.ExamRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/**
 * Serves sitemap.xml from the database so newly uploaded exams appear without
 * anyone editing a file. The static sitemap in the frontend build cannot do
 * this: Vercel serves it as a fixed asset and knows nothing about uploads.
 */
@RestController
public class SitemapController {

    private static final String SITE = "https://westernexams.com";
    private static final DateTimeFormatter W3C = DateTimeFormatter.ISO_INSTANT;

    private final ExamRepository examRepository;

    public SitemapController(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        StringBuilder xml = new StringBuilder(1024);
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
           .append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        appendUrl(xml, SITE + "/", null, "weekly", "1.0");
        appendUrl(xml, SITE + "/search", null, "daily", "0.8");

        // findAll() is fine at the current scale. The sitemap spec caps a
        // single file at 50,000 URLs, so past that this needs to page and emit
        // a sitemap index rather than one document.
        for (Exam exam : examRepository.findAll()) {
            String lastmod = exam.getCreatedAt() == null ? null
                    : W3C.format(exam.getCreatedAt().toInstant(ZoneOffset.UTC));
            appendUrl(xml, SITE + "/exams/" + exam.getId(), lastmod, "monthly", "0.6");
        }

        xml.append("</urlset>\n");

        return ResponseEntity.ok()
                // Crawlers re-fetch this often; an hour of caching keeps the
                // query off the hot path without going stale for long.
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(xml.toString());
    }

    private void appendUrl(StringBuilder xml, String loc, String lastmod,
                           String changefreq, String priority) {
        xml.append("  <url>\n")
           .append("    <loc>").append(escape(loc)).append("</loc>\n");

        if (lastmod != null) {
            xml.append("    <lastmod>").append(lastmod).append("</lastmod>\n");
        }

        xml.append("    <changefreq>").append(changefreq).append("</changefreq>\n")
           .append("    <priority>").append(priority).append("</priority>\n")
           .append("  </url>\n");
    }

    /** URLs are built from UUIDs, but escaping keeps the XML valid regardless. */
    private String escape(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
