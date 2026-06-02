package com.swp391.horseracing.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Trong thực tế sẽ cần mã hóa password_hash ở đây bằng BCrypt
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPasswordHash().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
}