package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.request.UpdateJockeyProfileRequest;
import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.JockeyProfileRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JockeyProfileService {
    @Autowired
    private JockeyProfileRepository jockeyProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public JockeyProfile setupProfile(UpdateJockeyProfileRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getAvatarUrl() != null) {
            String avatarUrl = request.getAvatarUrl().trim();
            if (avatarUrl.length() > 3_000_000) {
                throw new IllegalArgumentException("Profile image is too large");
            }
            user.setAvatarUrl(avatarUrl.isEmpty() ? null : avatarUrl);

        }

        userRepository.save(user);

        JockeyProfile profile = jockeyProfileRepository.findByUserId(userId)
                .orElseGet(JockeyProfile::new);
        profile.setUser(user);
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setWeightKg(request.getWeightKg());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setInvitationRate(request.getInvitationRate());
        profile.setInternationalTravel(Boolean.TRUE.equals(request.getInternationalTravel()));
        profile.setExperienceYears(request.getExperienceYears());
        profile.setBio(request.getBio());
        profile.setActive(Boolean.TRUE.equals(request.getActive()));
        return jockeyProfileRepository.save(profile);
    }
    public JockeyProfile getProfile(Long userId) {
        return jockeyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Error: Profile not found!"));
    }
}
