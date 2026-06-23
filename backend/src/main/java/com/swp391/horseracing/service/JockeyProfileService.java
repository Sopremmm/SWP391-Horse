package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.JockeyProfileRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JockeyProfileService {
    @Autowired
    private JockeyProfileRepository jockeyProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public JockeyProfile setupProfile(JockeyProfile profile, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        
        JockeyProfile existingProfile = jockeyProfileRepository.findByUserId(userId).orElse(null);
        if (existingProfile != null) {
            existingProfile.setLicenseNumber(profile.getLicenseNumber());
            existingProfile.setWeightKg(profile.getWeightKg());
            existingProfile.setExperienceYears(profile.getExperienceYears());
            existingProfile.setBio(profile.getBio());
            return jockeyProfileRepository.save(existingProfile);
        } else {
            profile.setUser(user);
            return jockeyProfileRepository.save(profile);
        }
    }

    public JockeyProfile getProfile(Long userId) {
        return jockeyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Error: Profile not found!"));
    }
}
