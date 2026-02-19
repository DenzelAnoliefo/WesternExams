package ca.uwo.westernexams.auth;

import ca.uwo.westernexams.email.EmailService;
import ca.uwo.westernexams.exception.DuplicateResourceException;
import ca.uwo.westernexams.jwt.JWTUtil;
import ca.uwo.westernexams.user.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final EmailService emailService;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 JWTUtil jwtUtil,
                                 EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.issueToken(
                user.getEmail(), List.of(user.getRole().name()));
        return new AuthenticationResponse(token, toDTO(user));
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.name(),
                Role.STUDENT
        );

        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        String token = jwtUtil.issueToken(
                user.getEmail(), List.of(user.getRole().name()));
        return new AuthenticationResponse(token, toDTO(user));
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }
}
