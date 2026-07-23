package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class UserQueryService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    public List<User> searchUsers(Role role, String q) {
        List<User> base = role == null ? userRepository.findAll() : userRepository.findByRole(role);
        String needle = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return base.stream()
                .filter(u -> {
                    if (needle.isBlank()) return true;
                    String email = u.getEmail() == null ? "" : u.getEmail().toLowerCase(Locale.ROOT);
                    String name = u.getFullName() == null ? "" : u.getFullName().toLowerCase(Locale.ROOT);
                    String phone = u.getPhone() == null ? "" : u.getPhone().toLowerCase(Locale.ROOT);
                    return email.contains(needle) || name.contains(needle) || phone.contains(needle);
                })
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }
}
