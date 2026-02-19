package ca.uwo.westernexams.exam;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ExamUploadRequest(
        @NotBlank String courseCode,
        @NotNull Term term,
        @NotNull Integer year,
        String professor,
        @NotNull ExamType examType
) {
}
