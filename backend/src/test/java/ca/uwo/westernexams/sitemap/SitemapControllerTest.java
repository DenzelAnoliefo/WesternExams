package ca.uwo.westernexams.sitemap;

import ca.uwo.westernexams.course.Course;
import ca.uwo.westernexams.exam.Exam;
import ca.uwo.westernexams.exam.ExamRepository;
import ca.uwo.westernexams.exam.ExamType;
import ca.uwo.westernexams.exam.Term;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SitemapControllerTest {

    @Mock
    private ExamRepository examRepository;

    @InjectMocks
    private SitemapController controller;

    private Exam buildExam(UUID id) {
        Course course = new Course();
        course.setCode("CS1027");
        course.setName("CS Fundamentals II");

        Exam exam = new Exam();
        exam.setId(id);
        exam.setCourse(course);
        exam.setTerm(Term.FALL);
        exam.setYear(2024);
        exam.setExamType(ExamType.MIDTERM);
        // createdAt is assigned in @PrePersist and has no setter, so it stays
        // null here — which also exercises the lastmod null path.
        return exam;
    }

    @Test
    void sitemap_isWellFormedXmlAndIncludesEachExam() throws Exception {
        UUID id = UUID.randomUUID();
        when(examRepository.findAll()).thenReturn(List.of(buildExam(id)));

        String xml = controller.sitemap().getBody();

        // Parsing is the real assertion: malformed XML is rejected outright.
        DocumentBuilderFactory.newInstance().newDocumentBuilder()
                .parse(new ByteArrayInputStream(xml.getBytes()));

        assertThat(xml).contains("https://westernexams.com/");
        assertThat(xml).contains("https://westernexams.com/search");
        assertThat(xml).contains("https://westernexams.com/exams/" + id);
    }

    @Test
    void sitemap_withNoExams_isStillValid() throws Exception {
        when(examRepository.findAll()).thenReturn(List.of());

        String xml = controller.sitemap().getBody();

        DocumentBuilderFactory.newInstance().newDocumentBuilder()
                .parse(new ByteArrayInputStream(xml.getBytes()));
        assertThat(xml).contains("https://westernexams.com/search");
    }
}
