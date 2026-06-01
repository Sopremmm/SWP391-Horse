package com.swp391.horseracing.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Hỗ trợ kết nối với Frontend (React/Vue) không bị lỗi CORS
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Email đã tồn tại trên hệ thống!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        Optional<User> user = userService.login(loginData.get("email"), loginData.get("password"));
        if (user.isPresent()) {
            // Demo trả về Object, giai đoạn sau sẽ tích hợp JWT token tại đây
            return ResponseEntity.ok(Map.of(
                    "message", "Đăng nhập thành công!",
                    "user", user.get()
            ));
        }
        return ResponseEntity.status(401).body("Tài khoản hoặc mật khẩu không chính xác!");
    }
}