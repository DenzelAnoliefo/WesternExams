package ca.uwo.westernexams.auth;

import ca.uwo.westernexams.user.UserDTO;

public record AuthenticationResponse(String token, UserDTO user) {
}
