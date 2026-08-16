package ca.uwo.westernexams.exam;

import ca.uwo.westernexams.course.Course;
import ca.uwo.westernexams.course.CourseRepository;
import ca.uwo.westernexams.exception.ResourceNotFoundException;
import ca.uwo.westernexams.s3.S3Buckets;
import ca.uwo.westernexams.s3.S3Service;
import ca.uwo.westernexams.user.Role;
import ca.uwo.westernexams.user.User;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private S3Service s3Service;
    @Mock
    private S3Buckets s3Buckets;

    @InjectMocks
    private ExamService examService;

    private Exam buildExam(User uploader) {
        Course course = new Course("CS1027", "Computer Science Fundamentals II", "Science");
        Exam exam = new Exam();
        exam.setId(UUID.randomUUID());
        exam.setCourse(course);
        exam.setS3Key("exams/CS1027/test.pdf");
        exam.setTerm(Term.FALL);
        exam.setYear(2024);
        exam.setProfessor("Dr. Smith");
        exam.setExamType(ExamType.MIDTERM);
        exam.setUploadedBy(uploader);
        return exam;
    }

    private User buildUser(Role role) {
        return new User(UUID.randomUUID(), "user@uwo.ca", "encoded", "Test User", role);
    }

    @Test
    void searchExams_withNoFilters_callsFindAllExams() {
        Pageable pageable = PageRequest.of(0, 20);
        User user = buildUser(Role.STUDENT);
        Exam exam = buildExam(user);
        when(examRepository.findAllExams(pageable))
                .thenReturn(new PageImpl<>(List.of(exam)));

        ExamSearchCriteria criteria = new ExamSearchCriteria(null, null, null, null, null);
        examService.searchExams(criteria, pageable);

        verify(examRepository).findAllExams(pageable);
        verify(examRepository, never()).searchExams(any(), any(), any(), any(), any());
    }

    @Test
    void searchExams_withFilters_callsSearchExams() {
        Pageable pageable = PageRequest.of(0, 20);
        when(examRepository.searchExams(eq("CS"), isNull(), isNull(), isNull(), eq(pageable)))
                .thenReturn(Page.empty());

        ExamSearchCriteria criteria = new ExamSearchCriteria("CS", null, null, null, null);
        examService.searchExams(criteria, pageable);

        verify(examRepository).searchExams("CS", null, null, null, pageable);
    }

    @Test
    void searchExams_mapsToDTO() {
        Pageable pageable = PageRequest.of(0, 20);
        User user = buildUser(Role.STUDENT);
        Exam exam = buildExam(user);
        when(examRepository.findAllExams(pageable))
                .thenReturn(new PageImpl<>(List.of(exam)));

        ExamSearchCriteria criteria = new ExamSearchCriteria(null, null, null, null, null);
        Page<ExamDTO> result = examService.searchExams(criteria, pageable);

        assertThat(result.getContent()).hasSize(1);
        ExamDTO dto = result.getContent().get(0);
        assertThat(dto.courseCode()).isEqualTo("CS1027");
        assertThat(dto.courseName()).isEqualTo("Computer Science Fundamentals II");
        assertThat(dto.term()).isEqualTo(Term.FALL);
        assertThat(dto.year()).isEqualTo(2024);
        assertThat(dto.professor()).isEqualTo("Dr. Smith");
        assertThat(dto.examType()).isEqualTo(ExamType.MIDTERM);
        assertThat(dto.uploadedByName()).isEqualTo("Test User");
    }

    @Test
    void getExam_existingId_returnsDTO() {
        User user = buildUser(Role.STUDENT);
        Exam exam = buildExam(user);
        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));

        ExamDTO dto = examService.getExam(exam.getId());

        assertThat(dto.courseCode()).isEqualTo("CS1027");
    }

    @Test
    void getExam_nonExistingId_throwsResourceNotFoundException() {
        UUID id = UUID.randomUUID();
        when(examRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> examService.getExam(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void downloadExam_existingId_returnsBytes() {
        User user = buildUser(Role.STUDENT);
        Exam exam = buildExam(user);
        byte[] pdfBytes = "pdf-content".getBytes();
        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));
        when(s3Buckets.getExams()).thenReturn("test-bucket");
        when(s3Service.getObject("test-bucket", "exams/CS1027/test.pdf")).thenReturn(pdfBytes);

        byte[] result = examService.downloadExam(exam.getId());

        assertThat(result).isEqualTo(pdfBytes);
    }

    @Test
    void previewExam_returnsOnlyTheFirstPage() throws Exception {
        User user = buildUser(Role.STUDENT);
        Exam exam = buildExam(user);

        // A real three-page PDF, so the page count is actually exercised.
        byte[] threePages;
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            doc.addPage(new PDPage());
            doc.addPage(new PDPage());
            doc.addPage(new PDPage());
            doc.save(out);
            threePages = out.toByteArray();
        }

        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));
        when(s3Buckets.getExams()).thenReturn("test-bucket");
        when(s3Service.getObject("test-bucket", "exams/CS1027/test.pdf")).thenReturn(threePages);

        byte[] preview = examService.previewExam(exam.getId());

        try (PDDocument result = Loader.loadPDF(preview)) {
            assertThat(result.getNumberOfPages()).isEqualTo(1);
        }
        assertThat(preview).isNotEqualTo(threePages);
    }

    @Test
    void downloadExam_nonExistingId_throwsResourceNotFoundException() {
        UUID id = UUID.randomUUID();
        when(examRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> examService.downloadExam(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void uploadExam_validPdf_savesAndReturnsDTO() {
        User uploader = buildUser(Role.STUDENT);
        Course course = new Course("CS1027", "Computer Science Fundamentals II", "Science");
        MockMultipartFile file = new MockMultipartFile(
                "file", "exam.pdf", "application/pdf", "pdf-content".getBytes());
        ExamUploadRequest request = new ExamUploadRequest(
                "CS1027", Term.FALL, 2024, "Dr. Smith", ExamType.MIDTERM);

        when(courseRepository.findById("CS1027")).thenReturn(Optional.of(course));
        when(s3Buckets.getExams()).thenReturn("test-bucket");

        ExamDTO result = examService.uploadExam(request, file, uploader);

        ArgumentCaptor<String> keyCaptor = ArgumentCaptor.forClass(String.class);
        verify(s3Service).putObject(eq("test-bucket"), keyCaptor.capture(), any(byte[].class));
        assertThat(keyCaptor.getValue()).startsWith("exams/CS1027/").endsWith(".pdf");

        verify(examRepository).save(any(Exam.class));
        assertThat(result.courseCode()).isEqualTo("CS1027");
        assertThat(result.term()).isEqualTo(Term.FALL);
    }

    @Test
    void uploadExam_nonPdfContentType_throwsIllegalArgumentException() {
        User uploader = buildUser(Role.STUDENT);
        MockMultipartFile file = new MockMultipartFile(
                "file", "image.png", "image/png", "content".getBytes());
        ExamUploadRequest request = new ExamUploadRequest(
                "CS1027", Term.FALL, 2024, null, ExamType.MIDTERM);

        assertThatThrownBy(() -> examService.uploadExam(request, file, uploader))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only PDF files are allowed");

        verify(s3Service, never()).putObject(any(), any(), any());
    }

    @Test
    void uploadExam_nullContentType_throwsIllegalArgumentException() {
        User uploader = buildUser(Role.STUDENT);
        MockMultipartFile file = new MockMultipartFile(
                "file", "exam.pdf", null, "content".getBytes());
        ExamUploadRequest request = new ExamUploadRequest(
                "CS1027", Term.FALL, 2024, null, ExamType.MIDTERM);

        assertThatThrownBy(() -> examService.uploadExam(request, file, uploader))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void uploadExam_courseNotFound_throwsResourceNotFoundException() {
        User uploader = buildUser(Role.STUDENT);
        MockMultipartFile file = new MockMultipartFile(
                "file", "exam.pdf", "application/pdf", "content".getBytes());
        ExamUploadRequest request = new ExamUploadRequest(
                "FAKE999", Term.FALL, 2024, null, ExamType.MIDTERM);

        when(courseRepository.findById("FAKE999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> examService.uploadExam(request, file, uploader))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteExam_byOwner_deletesFromS3AndRepository() {
        User owner = buildUser(Role.STUDENT);
        Exam exam = buildExam(owner);
        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));
        when(s3Buckets.getExams()).thenReturn("test-bucket");

        examService.deleteExam(exam.getId(), owner);

        verify(s3Service).deleteObject("test-bucket", "exams/CS1027/test.pdf");
        verify(examRepository).delete(exam);
    }

    @Test
    void deleteExam_byAdmin_deletesSuccessfully() {
        User owner = buildUser(Role.STUDENT);
        User admin = new User(UUID.randomUUID(), "admin@uwo.ca", "encoded", "Admin", Role.ADMIN);
        Exam exam = buildExam(owner);
        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));
        when(s3Buckets.getExams()).thenReturn("test-bucket");

        examService.deleteExam(exam.getId(), admin);

        verify(s3Service).deleteObject("test-bucket", "exams/CS1027/test.pdf");
        verify(examRepository).delete(exam);
    }

    @Test
    void deleteExam_byNonOwnerStudent_throwsAccessDeniedException() {
        User owner = buildUser(Role.STUDENT);
        User otherStudent = new User(UUID.randomUUID(), "other@uwo.ca", "encoded", "Other", Role.STUDENT);
        Exam exam = buildExam(owner);
        when(examRepository.findById(exam.getId())).thenReturn(Optional.of(exam));

        assertThatThrownBy(() -> examService.deleteExam(exam.getId(), otherStudent))
                .isInstanceOf(AccessDeniedException.class);

        verify(s3Service, never()).deleteObject(any(), any());
    }

    @Test
    void deleteExam_nonExistingId_throwsResourceNotFoundException() {
        UUID id = UUID.randomUUID();
        User user = buildUser(Role.STUDENT);
        when(examRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> examService.deleteExam(id, user))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
