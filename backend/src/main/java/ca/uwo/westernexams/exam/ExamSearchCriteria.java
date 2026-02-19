package ca.uwo.westernexams.exam;

public record ExamSearchCriteria(
        String search,
        String faculty,
        Integer level,
        Integer year,
        Term term
) {
}
