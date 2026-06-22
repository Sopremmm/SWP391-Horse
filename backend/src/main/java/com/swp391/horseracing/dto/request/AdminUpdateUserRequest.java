package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class AdminUpdateUserRequest {
    @Email
    private String email;

    private String fullName;

    private String phone;

    private String role;

    @Size(min = 6)
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
