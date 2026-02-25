package ca.uwo.westernexams.course;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void searchCourses_nullQuery_returnsAll() {
        Course cs1027 = new Course("CS1027", "Computer Science Fundamentals II", "Science");
        when(courseRepository.findAll()).thenReturn(List.of(cs1027));

        List<CourseDTO> result = courseService.searchCourses(null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).code()).isEqualTo("CS1027");
        verify(courseRepository).findAll();
        verify(courseRepository, never())
                .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(any(), any());
    }

    @Test
    void searchCourses_blankQuery_returnsAll() {
        when(courseRepository.findAll()).thenReturn(Collections.emptyList());

        courseService.searchCourses("   ");

        verify(courseRepository).findAll();
        verify(courseRepository, never())
                .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(any(), any());
    }

    @Test
    void searchCourses_withQuery_callsSearchMethod() {
        when(courseRepository.findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase("CS", "CS"))
                .thenReturn(List.of(new Course("CS1027", "Computer Science Fundamentals II", "Science")));

        List<CourseDTO> result = courseService.searchCourses("CS");

        assertThat(result).hasSize(1);
        verify(courseRepository)
                .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase("CS", "CS");
    }

    @Test
    void searchCourses_mapsToDTO() {
        Course course = new Course("CS1027", "Computer Science Fundamentals II", "Science");
        when(courseRepository.findAll()).thenReturn(List.of(course));

        List<CourseDTO> result = courseService.searchCourses(null);

        assertThat(result).hasSize(1);
        CourseDTO dto = result.get(0);
        assertThat(dto.code()).isEqualTo("CS1027");
        assertThat(dto.name()).isEqualTo("Computer Science Fundamentals II");
        assertThat(dto.faculty()).isEqualTo("Science");
    }

    @Test
    void searchCourses_emptyResult_returnsEmptyList() {
        when(courseRepository.findAll()).thenReturn(Collections.emptyList());

        List<CourseDTO> result = courseService.searchCourses(null);

        assertThat(result).isEmpty();
    }
}
