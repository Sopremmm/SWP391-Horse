package com.swp391.horseracing.dto.request;

import java.math.BigDecimal;

public class UpdateJockeyProfileRequest {
    private String fullName;
    private String licenseNumber;
    private Integer age;
    private String gender;
    private BigDecimal invitationRate;
    private Boolean internationalTravel;
    private Double weightKg;
    private Integer experienceYears;
    private String bio;
    private Boolean active;
    private String avatarUrl;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public BigDecimal getInvitationRate() { return invitationRate; }
    public void setInvitationRate(BigDecimal invitationRate) { this.invitationRate = invitationRate; }
    public Boolean getInternationalTravel() { return internationalTravel; }
    public void setInternationalTravel(Boolean internationalTravel) { this.internationalTravel = internationalTravel; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}