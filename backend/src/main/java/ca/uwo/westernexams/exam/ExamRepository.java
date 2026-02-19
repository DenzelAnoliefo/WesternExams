package ca.uwo.westernexams.exam;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {

    @Query(value = """
            SELECT e FROM Exam e JOIN FETCH e.course c JOIN FETCH e.uploadedBy u
            WHERE (COALESCE(:search, '') = '' OR UPPER(c.code) LIKE UPPER(CONCAT('%', :search, '%'))
                   OR UPPER(c.name) LIKE UPPER(CONCAT('%', :search, '%')))
            AND (COALESCE(:faculty, '') = '' OR c.faculty = :faculty)
            AND (:year IS NULL OR e.year = :year)
            AND (:term IS NULL OR e.term = :term)
            ORDER BY e.createdAt DESC
            """,
            countQuery = """
            SELECT COUNT(e) FROM Exam e JOIN e.course c
            WHERE (COALESCE(:search, '') = '' OR UPPER(c.code) LIKE UPPER(CONCAT('%', :search, '%'))
                   OR UPPER(c.name) LIKE UPPER(CONCAT('%', :search, '%')))
            AND (COALESCE(:faculty, '') = '' OR c.faculty = :faculty)
            AND (:year IS NULL OR e.year = :year)
            AND (:term IS NULL OR e.term = :term)
            """)
    Page<Exam> searchExams(
            @Param("search") String search,
            @Param("faculty") String faculty,
            @Param("year") Integer year,
            @Param("term") Term term,
            Pageable pageable
    );

    @Query(value = """
            SELECT e FROM Exam e JOIN FETCH e.course JOIN FETCH e.uploadedBy
            ORDER BY e.createdAt DESC
            """,
            countQuery = "SELECT COUNT(e) FROM Exam e")
    Page<Exam> findAllExams(Pageable pageable);
}
