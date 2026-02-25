package ca.uwo.westernexams.exam;

import ca.uwo.westernexams.exception.ResourceNotFoundException;
import ca.uwo.westernexams.jwt.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExamController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ExamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExamService examService;

    @MockBean
    private JWTUtil jwtUtil;

    private ExamDTO buildExamDTO() {
        return new ExamDTO(
                UUID.randomUUID(), "CS1027", "CS Fundamentals II",
                Term.FALL, 2024, "Dr. Smith", ExamType.MIDTERM,
                "Test User", LocalDateTime.now());
    }

    @Test
    void searchExams_returnsOkWithPage() throws Exception {
        ExamDTO dto = buildExamDTO();
        when(examService.searchExams(any(ExamSearchCriteria.class), any()))
                .thenReturn(new PageImpl<>(List.of(dto), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/exams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].courseCode").value("CS1027"));
    }

    @Test
    void searchExams_withFilters_returnsOk() throws Exception {
        when(examService.searchExams(any(), any()))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 20), 0));

        mockMvc.perform(get("/api/v1/exams")
                        .param("search", "CS")
                        .param("year", "2024")
                        .param("term", "FALL"))
                .andExpect(status().isOk());
    }

    @Test
    void getExam_returnsExamDTO() throws Exception {
        ExamDTO dto = buildExamDTO();
        when(examService.getExam(dto.id())).thenReturn(dto);

        mockMvc.perform(get("/api/v1/exams/{id}", dto.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseCode").value("CS1027"));
    }

    @Test
    void getExam_notFound_returns404() throws Exception {
        UUID id = UUID.randomUUID();
        when(examService.getExam(id)).thenThrow(new ResourceNotFoundException("Exam not found"));

        mockMvc.perform(get("/api/v1/exams/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void downloadExam_returnsPdfBytes() throws Exception {
        UUID id = UUID.randomUUID();
        byte[] pdfBytes = "pdf-content".getBytes();
        when(examService.downloadExam(id)).thenReturn(pdfBytes);

        mockMvc.perform(get("/api/v1/exams/{id}/download", id))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", "inline; filename=exam.pdf"))
                .andExpect(content().bytes(pdfBytes));
    }

    @Test
    void uploadExam_returns201() throws Exception {
        ExamDTO dto = buildExamDTO();
        when(examService.uploadExam(any(ExamUploadRequest.class), any(), any()))
                .thenReturn(dto);

        MockMultipartFile file = new MockMultipartFile(
                "file", "exam.pdf", "application/pdf", "pdf-content".getBytes());
        MockMultipartFile metadata = new MockMultipartFile(
                "metadata", "", "application/json",
                objectMapper.writeValueAsBytes(
                        new ExamUploadRequest("CS1027", Term.FALL, 2024, "Dr. Smith", ExamType.MIDTERM)));

        mockMvc.perform(multipart("/api/v1/exams")
                        .file(file)
                        .file(metadata))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseCode").value("CS1027"));
    }

    @Test
    void deleteExam_returns204() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/exams/{id}", id))
                .andExpect(status().isNoContent());
    }
}
