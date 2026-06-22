package com.swp391.horseracing.dto.response;

import java.time.LocalDateTime;

public class AdminRaceListItemResponse {
    private Long id;
    private Long tournamentId;
    private String tournamentName;
    private Long refereeId;
    private String refereeName;
    private String name;
    private Integer roundNumber;
    private LocalDateTime raceDate;
    private Integer distanceM;
    private String status;
    private AdminRaceChecklistResponse checklist;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTournamentId() { return tournamentId; }
    public void setTournamentId(Long tournamentId) { this.tournamentId = tournamentId; }
    public String getTournamentName() { return tournamentName; }
    public void setTournamentName(String tournamentName) { this.tournamentName = tournamentName; }
    public Long getRefereeId() { return refereeId; }
    public void setRefereeId(Long refereeId) { this.refereeId = refereeId; }
    public String getRefereeName() { return refereeName; }
    public void setRefereeName(String refereeName) { this.refereeName = refereeName; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getRoundNumber() { return roundNumber; }
    public void setRoundNumber(Integer roundNumber) { this.roundNumber = roundNumber; }
    public LocalDateTime getRaceDate() { return raceDate; }
    public void setRaceDate(LocalDateTime raceDate) { this.raceDate = raceDate; }
    public Integer getDistanceM() { return distanceM; }
    public void setDistanceM(Integer distanceM) { this.distanceM = distanceM; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public AdminRaceChecklistResponse getChecklist() { return checklist; }
    public void setChecklist(AdminRaceChecklistResponse checklist) { this.checklist = checklist; }
}

