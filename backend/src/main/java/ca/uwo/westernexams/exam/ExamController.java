package ca.uwo.westernexams.exam;

import ca.uwo.westernexams.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public Page<ExamDTO> searchExams(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String faculty,
            @RequestParam(required = false) Integer level,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Term term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        ExamSearchCriteria criteria = new ExamSearchCriteria(
                search, faculty, level, year, term);
        return examService.searchExams(criteria, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ExamDTO getExam(@PathVariable UUID id) {
        return examService.getExam(id);
    }

    /** Public: first page only, for the preview on the exam detail page. */
    @GetMapping("/{id}/preview")
    public ResponseEntity<byte[]> previewExam(@PathVariable UUID id) {
        byte[] pdf = examService.previewExam(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=preview.pdf")
                .body(pdf);
    }

    /** Authenticated: the complete exam PDF. */
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadExam(@PathVariable UUID id) {
        byte[] pdf = examService.downloadExam(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=exam.pdf")
                .body(pdf);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExamDTO> uploadExam(
            @RequestPart("metadata") @Valid ExamUploadRequest request,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        ExamDTO dto = examService.uploadExam(request, file, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExam(@PathVariable UUID id,
                           @AuthenticationPrincipal User user) {
        examService.deleteExam(id, user);
    }
}
