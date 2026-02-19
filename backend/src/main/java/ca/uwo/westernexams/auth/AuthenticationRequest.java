package ca.uwo.westernexams.auth;

public record AuthenticationRequest(String email, String password) {
}
