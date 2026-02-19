package ca.uwo.westernexams.exam;

import ca.uwo.westernexams.course.Course;
import ca.uwo.westernexams.course.CourseRepository;
import ca.uwo.westernexams.exception.ResourceNotFoundException;
import ca.uwo.westernexams.s3.S3Buckets;
import ca.uwo.westernexams.s3.S3Service;
import ca.uwo.westernexams.user.Role;
import ca.uwo.westernexams.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public ExamService(ExamRepository examRepository,
                       CourseRepository courseRepository,
                       S3Service s3Service,
                       S3Buckets s3Buckets) {
        this.examRepository = examRepository;
        this.courseRepository = courseRepository;
        this.s3Service = s3Service;
        this.s3Buckets = s3Buckets;
    }

    public Page<ExamDTO> searchExams(ExamSearchCriteria criteria, Pageable pageable) {
        boolean hasFilters = criteria.search() != null
                || criteria.faculty() != null
                || criteria.year() != null
                || criteria.term() != null;

        if (!hasFilters) {
            return examRepository.findAllExams(pageable).map(this::toDTO);
        }

        return examRepository.searchExams(
                criteria.search(),
                criteria.faculty(),
                criteria.year(),
                criteria.term(),
                pageable
        ).map(this::toDTO);
    }

    public ExamDTO getExam(UUID id) {
        return examRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Exam not found with id: " + id));
    }

    public byte[] downloadExam(UUID id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Exam not found with id: " + id));
        return s3Service.getObject(s3Buckets.getExams(), exam.getS3Key());
    }

    @Transactional
    public ExamDTO uploadExam(ExamUploadRequest request, MultipartFile file, User uploader) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        Course course = courseRepository.findById(request.courseCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found: " + request.courseCode()));

        String s3Key = "exams/%s/%s.pdf".formatted(
                request.courseCode(), UUID.randomUUID());

        try {
            s3Service.putObject(
                    s3Buckets.getExams(),
                    s3Key,
                    file.getBytes()
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }

        Exam exam = new Exam();
        exam.setCourse(course);
        exam.setS3Key(s3Key);
        exam.setTerm(request.term());
        exam.setYear(request.year());
        exam.setProfessor(request.professor());
        exam.setExamType(request.examType());
        exam.setUploadedBy(uploader);

        examRepository.save(exam);
        return toDTO(exam);
    }

    @Transactional
    public void deleteExam(UUID id, User requester) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Exam not found with id: " + id));

        if (!exam.getUploadedBy().getId().equals(requester.getId())
                && requester.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Not authorized to delete this exam");
        }

        s3Service.deleteObject(s3Buckets.getExams(), exam.getS3Key());
        examRepository.delete(exam);
    }

    private ExamDTO toDTO(Exam e) {
        return new ExamDTO(
                e.getId(),
                e.getCourse().getCode(),
                e.getCourse().getName(),
                e.getTerm(),
                e.getYear(),
                e.getProfessor(),
                e.getExamType(),
                e.getUploadedBy().getName(),
                e.getCreatedAt()
        );
    }
}
