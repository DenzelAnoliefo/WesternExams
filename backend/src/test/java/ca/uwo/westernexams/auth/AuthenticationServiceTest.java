package ca.uwo.westernexams.auth;

import ca.uwo.westernexams.email.EmailService;
import ca.uwo.westernexams.exception.DuplicateResourceException;
import ca.uwo.westernexams.jwt.JWTUtil;
import ca.uwo.westernexams.user.Role;
import ca.uwo.westernexams.user.User;
import ca.uwo.westernexams.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JWTUtil jwtUtil;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void login_withValidCredentials_returnsTokenAndUserDTO() {
        User user = new User(UUID.randomUUID(), "user@uwo.ca", "encoded", "Test User", Role.STUDENT);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(jwtUtil.issueToken(eq("user@uwo.ca"), eq(List.of("STUDENT"))))
                .thenReturn("jwt-token");

        AuthenticationResponse response = authenticationService.login(
                new AuthenticationRequest("user@uwo.ca", "password"));

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("user@uwo.ca");
        assertThat(response.user().name()).isEqualTo("Test User");
        assertThat(response.user().role()).isEqualTo(Role.STUDENT);
    }

    @Test
    void register_withNewEmail_createsUserAndReturnsToken() {
        when(userRepository.existsByEmail("new@uwo.ca")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(jwtUtil.issueToken(eq("new@uwo.ca"), eq(List.of("STUDENT"))))
                .thenReturn("jwt-token");

        AuthenticationResponse response = authenticationService.register(
                new RegisterRequest("new@uwo.ca", "password123", "New User"));

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("new@uwo.ca");
        assertThat(response.user().name()).isEqualTo("New User");

        verify(userRepository).save(any(User.class));
        verify(emailService).sendWelcomeEmail("new@uwo.ca", "New User");
    }

    @Test
    void register_withExistingEmail_throwsDuplicateResourceException() {
        when(userRepository.existsByEmail("existing@uwo.ca")).thenReturn(true);

        assertThatThrownBy(() -> authenticationService.register(
                new RegisterRequest("existing@uwo.ca", "password123", "User")))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already registered");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_encodesPassword() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode("rawpassword")).thenReturn("encoded-password");
        when(jwtUtil.issueToken(any(), anyList())).thenReturn("token");

        authenticationService.register(
                new RegisterRequest("user@uwo.ca", "rawpassword", "User"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword()).isEqualTo("encoded-password");
    }

    @Test
    void register_assignsStudentRole() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(jwtUtil.issueToken(any(), anyList())).thenReturn("token");

        authenticationService.register(
                new RegisterRequest("user@uwo.ca", "password123", "User"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo(Role.STUDENT);
    }
}
