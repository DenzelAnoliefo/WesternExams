package ca.uwo.westernexams.course;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDTO> searchCourses(String query) {
        List<Course> courses;
        if (query == null || query.isBlank()) {
            courses = courseRepository.findAll();
        } else {
            courses = courseRepository
                    .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        }
        return courses.stream()
                .map(c -> new CourseDTO(c.getCode(), c.getName(), c.getFaculty()))
                .toList();
    }
}
