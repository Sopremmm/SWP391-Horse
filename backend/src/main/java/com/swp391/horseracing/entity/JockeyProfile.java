package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "jockey_profile")
public class JockeyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "invitation_rate", precision = 15, scale = 2)
    private BigDecimal invitationRate;

    @Column(name = "international_travel", nullable = false)
    private Boolean internationalTravel = false;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(name = "total_races")
    private Integer totalRaces = 0;

    @Column(name = "total_wins")
    private Integer totalWins = 0;

    @Lob
    @Column
    private String bio;

    @Column(name = "is_active", nullable = false)
    private Boolean active = false;

    public JockeyProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public BigDecimal getInvitationRate() { return invitationRate; }
    public void setInvitationRate(BigDecimal invitationRate) { this.invitationRate = invitationRate; }
    public Boolean getInternationalTravel() { return internationalTravel; }
    public void setInternationalTravel(Boolean internationalTravel) { this.internationalTravel = internationalTravel; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Integer getTotalRaces() { return totalRaces; }
    public void setTotalRaces(Integer totalRaces) { this.totalRaces = totalRaces; }
    public Integer getTotalWins() { return totalWins; }
    public void setTotalWins(Integer totalWins) { this.totalWins = totalWins; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
