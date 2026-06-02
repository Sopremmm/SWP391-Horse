package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.JockeyProfileRequest;
import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.JockeyProfileRepository;
import com.swp391.horseracing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JockeyProfileService {
    private final JockeyProfileRepository jockeyProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public JockeyProfile createOrUpdateProfile(Long userId, JockeyProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.Role.JOCKEY) {
            throw new RuntimeException("Only jockeys can create a profile");
        }
        if (jockeyProfileRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            JockeyProfile existing = jockeyProfileRepository.findByUserId(userId).orElse(null);
            if (existing == null || !existing.getLicenseNumber().equals(request.getLicenseNumber())) {
                throw new RuntimeException("License number already in use");
            }
        }
        JockeyProfile profile = jockeyProfileRepository.findByUserId(userId)
                .orElse(new JockeyProfile());
        profile.setUser(user);
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setWeightKg(request.getWeightKg());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setBio(request.getBio());
        return jockeyProfileRepository.save(profile);
    }

    public JockeyProfile getProfileByUserId(Long userId) {
        return jockeyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}