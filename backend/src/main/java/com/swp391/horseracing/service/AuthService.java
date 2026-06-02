package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.*;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.UserRepository;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private static final List<User.Role> ALLOWED_REGISTER_ROLES = Arrays.asList(
            User.Role.HORSE_OWNER,
            User.Role.JOCKEY,
            User.Role.SPECTATOR
    );

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), userDetails.getFullName(), userDetails.getRole());
    }

    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (!ALLOWED_REGISTER_ROLES.contains(signUpRequest.getRole())) {
            throw new RuntimeException("Role is not allowed for registration!");
        }
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setPhone(signUpRequest.getPhone());
        user.setRole(signUpRequest.getRole());
        userRepository.save(user);
        return new MessageResponse("User registered successfully!");
    }
}