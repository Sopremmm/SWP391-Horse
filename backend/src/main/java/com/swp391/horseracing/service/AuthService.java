package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.request.LoginRequest;
import com.swp391.horseracing.dto.request.SignupRequest;
import com.swp391.horseracing.dto.response.JwtResponse;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.entity.enums.UserStatus;
import com.swp391.horseracing.repository.UserRepository;
import com.swp391.horseracing.security.jwt.JwtUtils;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private static final Set<Role> SELF_REGISTER_ROLES = Set.of(Role.HORSE_OWNER, Role.JOCKEY, Role.SPECTATOR);

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        String normalizedEmail = loginRequest.getEmail() == null ? null : loginRequest.getEmail().trim().toLowerCase(Locale.ROOT);
        String rawPassword = loginRequest.getPassword();
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Error: Invalid email or password!"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Error: Account is not active!");
        }

        String storedPassword = user.getPassword() == null ? null : user.getPassword().trim();
        if (!encoder.matches(rawPassword, storedPassword)) {
            throw new RuntimeException("Error: Invalid email or password!");
        }

        if (encoder.upgradeEncoding(storedPassword)) {
            user.setPassword(encoder.encode(rawPassword));
            user = userRepository.save(user);
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                roles);
    }

    public void registerUser(SignupRequest signUpRequest) {
        String normalizedEmail = signUpRequest.getEmail() == null ? null : signUpRequest.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (signUpRequest.getRole() == null || !SELF_REGISTER_ROLES.contains(signUpRequest.getRole())) {
            throw new RuntimeException("Error: You cannot self-register with this role!");
        }

        // Create new user's account
        User user = User.builder()
                .email(normalizedEmail)
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .role(signUpRequest.getRole())
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }
}
