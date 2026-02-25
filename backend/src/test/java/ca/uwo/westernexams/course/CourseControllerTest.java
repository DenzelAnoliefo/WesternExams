package ca.uwo.westernexams.course;

import ca.uwo.westernexams.jwt.JWTUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CourseController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private JWTUtil jwtUtil;

    @Test
    void getCourses_noQuery_returnsAll() throws Exception {
        when(courseService.searchCourses(null))
                .thenReturn(List.of(new CourseDTO("CS1027", "CS Fundamentals II", "Science")));

        mockMvc.perform(get("/api/v1/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("CS1027"));
    }

    @Test
    void getCourses_withQuery_passesQueryToService() throws Exception {
        when(courseService.searchCourses("CS"))
                .thenReturn(List.of(new CourseDTO("CS1027", "CS Fundamentals II", "Science")));

        mockMvc.perform(get("/api/v1/courses").param("q", "CS"))
                .andExpect(status().isOk());

        verify(courseService).searchCourses("CS");
    }

    @Test
    void getCourses_noAuthRequired() throws Exception {
        when(courseService.searchCourses(null)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/courses"))
                .andExpect(status().isOk());
    }

    @Test
    void getCourses_emptyResult_returnsEmptyArray() throws Exception {
        when(courseService.searchCourses(null)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
