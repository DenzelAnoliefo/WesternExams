package ca.uwo.westernexams.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JWTUtilTest {

    private JWTUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JWTUtil();
        ReflectionTestUtils.setField(jwtUtil, "secretKey",
                "westernexams-test-secret-key-must-be-at-least-256-bits-long-for-hmac-sha");
        ReflectionTestUtils.setField(jwtUtil, "expirationDays", 1);
    }

    @Test
    void issueToken_andGetSubject_returnsCorrectSubject() {
        String token = jwtUtil.issueToken("user@test.com");
        String subject = jwtUtil.getSubject(token);
        assertThat(subject).isEqualTo("user@test.com");
    }

    @Test
    void issueToken_withClaims_includesClaimsInToken() {
        String token = jwtUtil.issueToken("user@test.com",
                Map.of("scopes", List.of("ROLE_STUDENT")));
        String subject = jwtUtil.getSubject(token);
        assertThat(subject).isEqualTo("user@test.com");
    }

    @Test
    void issueToken_withListScopes_works() {
        String token = jwtUtil.issueToken("user@test.com", List.of("ROLE_STUDENT"));
        assertThat(jwtUtil.isTokenValid(token, "user@test.com")).isTrue();
    }

    @Test
    void isTokenValid_withCorrectUsername_returnsTrue() {
        String token = jwtUtil.issueToken("user@test.com");
        assertThat(jwtUtil.isTokenValid(token, "user@test.com")).isTrue();
    }

    @Test
    void isTokenValid_withWrongUsername_returnsFalse() {
        String token = jwtUtil.issueToken("user@test.com");
        assertThat(jwtUtil.isTokenValid(token, "other@test.com")).isFalse();
    }

    @Test
    void isTokenValid_withExpiredToken_returnsFalse() {
        JWTUtil expiredJwtUtil = new JWTUtil();
        ReflectionTestUtils.setField(expiredJwtUtil, "secretKey",
                "westernexams-test-secret-key-must-be-at-least-256-bits-long-for-hmac-sha");
        ReflectionTestUtils.setField(expiredJwtUtil, "expirationDays", -1);

        String token = expiredJwtUtil.issueToken("user@test.com");
        assertThatThrownBy(() -> expiredJwtUtil.isTokenValid(token, "user@test.com"))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }
}
