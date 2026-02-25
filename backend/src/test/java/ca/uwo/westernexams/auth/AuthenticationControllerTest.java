package ca.uwo.westernexams.auth;

import ca.uwo.westernexams.exception.DuplicateResourceException;
import ca.uwo.westernexams.jwt.JWTUtil;
import ca.uwo.westernexams.user.Role;
import ca.uwo.westernexams.user.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private JWTUtil jwtUtil;

    private AuthenticationResponse buildResponse() {
        return new AuthenticationResponse("jwt-token",
                new UserDTO(UUID.randomUUID(), "user@uwo.ca", "Test User", Role.STUDENT));
    }

    @Test
    void login_validRequest_returnsOkWithTokenInHeader() throws Exception {
        when(authenticationService.login(any(AuthenticationRequest.class)))
                .thenReturn(buildResponse());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AuthenticationRequest("user@uwo.ca", "password123"))))
                .andExpect(status().isOk())
                .andExpect(header().string("Authorization", "jwt-token"))
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("user@uwo.ca"));
    }

    @Test
    void register_validRequest_returns201WithTokenInHeader() throws Exception {
        when(authenticationService.register(any(RegisterRequest.class)))
                .thenReturn(buildResponse());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterRequest("user@uwo.ca", "password123", "Test User"))))
                .andExpect(status().isCreated())
                .andExpect(header().string("Authorization", "jwt-token"))
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void register_invalidEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterRequest("not-an-email", "password123", "User"))))
                .andExpect(status().isBadRequest());

        verify(authenticationService, never()).register(any());
    }

    @Test
    void register_shortPassword_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterRequest("user@uwo.ca", "12345", "User"))))
                .andExpect(status().isBadRequest());

        verify(authenticationService, never()).register(any());
    }

    @Test
    void register_blankName_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterRequest("user@uwo.ca", "password123", ""))))
                .andExpect(status().isBadRequest());

        verify(authenticationService, never()).register(any());
    }

    @Test
    void register_duplicateEmail_returns409() throws Exception {
        when(authenticationService.register(any(RegisterRequest.class)))
                .thenThrow(new DuplicateResourceException("Email already registered"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterRequest("user@uwo.ca", "password123", "User"))))
                .andExpect(status().isConflict());
    }
}
