package ca.uwo.westernexams.security;

import ca.uwo.westernexams.jwt.JWTAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityFilterChainConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    public SecurityFilterChainConfig(AuthenticationProvider authenticationProvider,
                                     JWTAuthenticationFilter jwtAuthenticationFilter,
                                     AuthenticationEntryPoint authenticationEntryPoint) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Exam metadata and the inline PDF preview are public so
                        // that search engines can index course pages and visitors
                        // can see an exam before being asked to sign up. Listed
                        // explicitly rather than as GET /api/v1/exams/** so a new
                        // GET endpoint is not made public by accident.
                        .requestMatchers(HttpMethod.GET, "/api/v1/exams").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/exams/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/exams/{id}/download").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/courses/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/actuator/**").permitAll()
                        // Uploads and deletes remain authenticated.
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(authenticationEntryPoint));

        return http.build();
    }
}
