package com.swp391.horseracing.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "referee_report")
public class RefereeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "race_id", nullable = false, unique = true)
    private Race race;

    @ManyToOne
    @JoinColumn(name = "referee_id")
    private User referee;

    @Lob
    @Column
    private String violations;

    @Lob
    @Column
    private String notes;

    private Boolean submitted = false;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    private Boolean confirmed = false;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    public RefereeReport() {}

    public RefereeReport(Long id, Race race, User referee, String violations, String notes, Boolean submitted, LocalDateTime submittedAt, Boolean confirmed, LocalDateTime confirmedAt) {
        this.id = id;
        this.race = race;
        this.referee = referee;
        this.violations = violations;
        this.notes = notes;
        this.submitted = submitted;
        this.submittedAt = submittedAt;
        this.confirmed = confirmed;
        this.confirmedAt = confirmedAt;
    }

    public static RefereeReportBuilder builder() {
        return new RefereeReportBuilder();
    }

    public static class RefereeReportBuilder {
        private Long id;
        private Race race;
        private User referee;
        private String violations;
        private String notes;
        private Boolean submitted = false;
        private LocalDateTime submittedAt;
        private Boolean confirmed = false;
        private LocalDateTime confirmedAt;

        public RefereeReportBuilder id(Long id) { this.id = id; return this; }
        public RefereeReportBuilder race(Race race) { this.race = race; return this; }
        public RefereeReportBuilder referee(User referee) { this.referee = referee; return this; }
        public RefereeReportBuilder violations(String violations) { this.violations = violations; return this; }
        public RefereeReportBuilder notes(String notes) { this.notes = notes; return this; }
        public RefereeReportBuilder submitted(Boolean submitted) { this.submitted = submitted; return this; }
        public RefereeReportBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public RefereeReportBuilder confirmed(Boolean confirmed) { this.confirmed = confirmed; return this; }
        public RefereeReportBuilder confirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; return this; }

        public RefereeReport build() {
            return new RefereeReport(id, race, referee, violations, notes, submitted, submittedAt, confirmed, confirmedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Race getRace() { return race; }
    public void setRace(Race race) { this.race = race; }
    public User getReferee() { return referee; }
    public void setReferee(User referee) { this.referee = referee; }
    public String getViolations() { return violations; }
    public void setViolations(String violations) { this.violations = violations; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Boolean getSubmitted() { return submitted; }
    public void setSubmitted(Boolean submitted) { this.submitted = submitted; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public Boolean getConfirmed() { return confirmed; }
    public void setConfirmed(Boolean confirmed) { this.confirmed = confirmed; }
    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
}
