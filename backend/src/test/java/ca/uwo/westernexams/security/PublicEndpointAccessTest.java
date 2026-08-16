package ca.uwo.westernexams.security;

import ca.uwo.westernexams.exam.ExamController;
import ca.uwo.westernexams.exam.ExamDTO;
import ca.uwo.westernexams.exam.ExamService;
import ca.uwo.westernexams.exam.ExamType;
import ca.uwo.westernexams.exam.Term;
import ca.uwo.westernexams.jwt.JWTAuthenticationFilter;
import ca.uwo.westernexams.jwt.JWTUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies that the public exam reads stay reachable without authentication.
 *
 * ExamControllerTest runs with addFilters = false, so it never exercises the
 * security filter chain at all. This test imports the real chain so that exam
 * metadata and the inline PDF preview are proven to stay open for crawlers and
 * signed-out visitors — gating any of them would break both search indexing
 * and the signed-out preview.
 *
 * Scope: reads only. See the note at the bottom of the class for why the write
 * endpoints cannot be asserted from this slice.
 */
@WebMvcTest(ExamController.class)
@Import(SecurityFilterChainConfig.class)
@ActiveProfiles("test")
class PublicEndpointAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExamService examService;

    @MockBean
    private JWTUtil jwtUtil;

    @MockBean
    private JWTAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private AuthenticationProvider authenticationProvider;

    @MockBean
    private AuthenticationEntryPoint authenticationEntryPoint;

    private ExamDTO buildExamDTO() {
        return new ExamDTO(
                UUID.randomUUID(), "CS1027", "CS Fundamentals II",
                Term.FALL, 2024, "Dr. Smith", ExamType.MIDTERM,
                "Test User", LocalDateTime.now());
    }

    @Test
    void searchExams_isPublic() throws Exception {
        when(examService.searchExams(any(), any()))
                .thenReturn(new PageImpl<>(List.of(buildExamDTO()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/exams"))
                .andExpect(status().isOk());
    }

    @Test
    void getExam_isPublic() throws Exception {
        UUID id = UUID.randomUUID();
        when(examService.getExam(id)).thenReturn(buildExamDTO());

        mockMvc.perform(get("/api/v1/exams/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void downloadExam_isPublic_soThePreviewRendersForSignedOutVisitors() throws Exception {
        UUID id = UUID.randomUUID();
        when(examService.downloadExam(id)).thenReturn(new byte[]{1, 2, 3});

        mockMvc.perform(get("/api/v1/exams/{id}/download", id))
                .andExpect(status().isOk());
    }

    /*
     * Deliberately not asserted here: that POST and DELETE reject anonymous
     * callers.
     *
     * This @WebMvcTest slice mocks JWTAuthenticationFilter and
     * AuthenticationEntryPoint — the two components that actually reject an
     * unauthenticated caller and write the 401 — so an anonymous write sails
     * through with 200 no matter what the rules say. A test asserting 401 here
     * would only pass by accident, so it is left out rather than written to
     * pass for the wrong reason.
     *
     * Those endpoints are covered by `anyRequest().authenticated()`, which the
     * public-read change above does not touch. Asserting them properly needs a
     * full @SpringBootTest with the real filter chain.
     */
}
