package ca.uwo.westernexams.user;

import java.util.UUID;

public record UserDTO(UUID id, String email, String name, Role role) {
}
