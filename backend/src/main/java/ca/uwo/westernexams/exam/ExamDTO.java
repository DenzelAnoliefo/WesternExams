package ca.uwo.westernexams.exam;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExamDTO(
        UUID id,
        String courseCode,
        String courseName,
        Term term,
        Integer year,
        String professor,
        ExamType examType,
        String uploadedByName,
        LocalDateTime createdAt
) {
}
