package com.swp391.horseracing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swp391.horseracing.entity.Notification;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.NotificationRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendE2EIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    void fullFlow_shouldWork_and_enforceOwnershipAndAuthz() throws Exception {
        String adminEmail = "admin@test.com";
        String owner1Email = "owner1@test.com";
        String owner2Email = "owner2@test.com";
        String jockeyEmail = "jockey@test.com";
        String refereeEmail = "referee@test.com";
        String password = "secret123";

        signup(adminEmail, password, "Admin", "000", "ADMIN");
        signup(owner1Email, password, "Owner One", "111", "HORSE_OWNER");
        signup(owner2Email, password, "Owner Two", "222", "HORSE_OWNER");
        signup(jockeyEmail, password, "Jockey", "333", "JOCKEY");
        signup(refereeEmail, password, "Referee", "444", "REFEREE");

        AuthSession admin = signin(adminEmail, password);
        AuthSession owner1 = signin(owner1Email, password);
        AuthSession owner2 = signin(owner2Email, password);
        AuthSession jockey = signin(jockeyEmail, password);
        AuthSession referee = signin(refereeEmail, password);

        mockMvc.perform(get("/api/tournaments"))
                .andExpect(status().isUnauthorized());

        setupJockeyProfile(jockey.token, "LIC-001");
        MvcResult jockeyProfile = mockMvc.perform(get("/api/jockeys/profile/my")
                        .header("Authorization", bearer(jockey.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(jockeyProfile.getResponse().getContentAsString()).contains("LIC-001");

        long horseId = createHorse(owner1.token, "Lightning");
        MvcResult myHorses = mockMvc.perform(get("/api/horses/my")
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(myHorses.getResponse().getContentAsString()).contains("\"id\":" + horseId);

        MvcResult horseGet = mockMvc.perform(get("/api/horses/" + horseId)
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(horseGet.getResponse().getContentAsString()).doesNotContain("password");

        mockMvc.perform(put("/api/horses/" + horseId)
                        .header("Authorization", bearer(owner2.token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Hacked"))))
                .andExpect(status().isBadRequest());

        long tournamentId = createTournament(admin.token, "Summer Cup");
        MvcResult tournaments = mockMvc.perform(get("/api/tournaments")
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(tournaments.getResponse().getContentAsString()).contains("\"id\":" + tournamentId);
        mockMvc.perform(get("/api/tournaments/" + tournamentId)
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk());

        long race1Id = createRace(admin.token, tournamentId, "Race 1", 1, LocalDateTime.now().plusDays(15));
        long race2Id = createRace(admin.token, tournamentId, "Race 2", 2, LocalDateTime.now().plusDays(16));
        MvcResult racesByTournament = mockMvc.perform(get("/api/races/tournament/" + tournamentId)
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(racesByTournament.getResponse().getContentAsString()).contains("\"id\":" + race1Id);

        mockMvc.perform(patch("/api/races/" + race1Id + "/referee")
                        .header("Authorization", bearer(admin.token))
                        .param("refereeId", referee.userId.toString()))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/tournaments/" + tournamentId + "/status")
                        .header("Authorization", bearer(admin.token))
                        .param("status", "OPEN"))
                .andExpect(status().isOk());

        long entryId = registerHorse(owner1.token, horseId, tournamentId);
        approveEntry(admin.token, entryId, race1Id);
        MvcResult entriesByTournament = mockMvc.perform(get("/api/entries/tournament/" + tournamentId)
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(entriesByTournament.getResponse().getContentAsString()).contains("\"id\":" + entryId);

        long invitationId = inviteJockey(owner1.token, horseId, jockey.userId, race1Id, "Please ride my horse");

        MvcResult myInvitations = mockMvc.perform(get("/api/invitations/my")
                        .header("Authorization", bearer(jockey.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(myInvitations.getResponse().getContentAsString()).contains("\"id\":" + invitationId);

        mockMvc.perform(patch("/api/invitations/" + invitationId + "/respond")
                        .header("Authorization", bearer(jockey.token))
                        .param("status", "ACCEPTED"))
                .andExpect(status().isOk());

        seedNotifications(owner1.userId, owner2.userId);
        MvcResult owner1Notifications = mockMvc.perform(get("/api/notifications/my")
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(owner1Notifications.getResponse().getContentAsString()).contains("Owner1 notification");

        Long owner1NotificationId = firstNotificationIdForUser(owner1.userId);
        mockMvc.perform(patch("/api/notifications/" + owner1NotificationId + "/read")
                        .header("Authorization", bearer(owner2.token)))
                .andExpect(status().isBadRequest());

        mockMvc.perform(patch("/api/notifications/" + owner1NotificationId + "/read")
                        .header("Authorization", bearer(owner1.token)))
                .andExpect(status().isOk());
    }

    private void signup(String email, String password, String fullName, String phone, String role) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("password", password);
        body.put("fullName", fullName);
        body.put("phone", phone);
        body.put("role", role);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }

    private AuthSession signin(String email, String password) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("password", password);

        MvcResult result = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return new AuthSession(json.get("token").asText(), json.get("id").asLong());
    }

    private long createHorse(String token, String name) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("breed", "Thoroughbred");
        body.put("age", 3);

        MvcResult result = mockMvc.perform(post("/api/horses")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private void setupJockeyProfile(String token, String licenseNumber) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("licenseNumber", licenseNumber);
        body.put("weightKg", 55.5);
        body.put("experienceYears", 2);
        body.put("bio", "Test profile");

        mockMvc.perform(post("/api/jockeys/profile")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }

    private long createTournament(String token, String name) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("location", "Hanoi");
        body.put("startDate", LocalDate.now().plusDays(10).toString());
        body.put("endDate", LocalDate.now().plusDays(12).toString());

        MvcResult result = mockMvc.perform(post("/api/tournaments")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private long createRace(String token, long tournamentId, String name, int roundNumber, LocalDateTime raceDate) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("roundNumber", roundNumber);
        body.put("raceDate", raceDate.toString());
        body.put("distanceM", 1200);

        MvcResult result = mockMvc.perform(post("/api/races/tournament/" + tournamentId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private long registerHorse(String token, long horseId, long tournamentId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/entries/register")
                        .header("Authorization", bearer(token))
                        .param("horseId", String.valueOf(horseId))
                        .param("tournamentId", String.valueOf(tournamentId)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private void approveEntry(String token, long entryId, long raceId) throws Exception {
        mockMvc.perform(patch("/api/entries/" + entryId + "/approve")
                        .header("Authorization", bearer(token))
                        .param("raceId", String.valueOf(raceId)))
                .andExpect(status().isOk());
    }

    private long inviteJockey(String token, long horseId, long jockeyId, long raceId, String message) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/invitations")
                        .header("Authorization", bearer(token))
                        .param("horseId", String.valueOf(horseId))
                        .param("jockeyId", String.valueOf(jockeyId))
                        .param("raceId", String.valueOf(raceId))
                        .param("message", message))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private void seedNotifications(long owner1UserId, long owner2UserId) {
        User owner1 = userRepository.findById(owner1UserId).orElseThrow();
        User owner2 = userRepository.findById(owner2UserId).orElseThrow();

        Notification n1 = Notification.builder()
                .user(owner1)
                .title("Owner1 notification")
                .message("Hello owner1")
                .type("SYSTEM")
                .refId(null)
                .refType(null)
                .isRead(false)
                .build();

        Notification n2 = Notification.builder()
                .user(owner2)
                .title("Owner2 notification")
                .message("Hello owner2")
                .type("SYSTEM")
                .refId(null)
                .refType(null)
                .isRead(false)
                .build();

        notificationRepository.save(n1);
        notificationRepository.save(n2);
    }

    private Long firstNotificationIdForUser(long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .findFirst()
                .orElseThrow()
                .getId();
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private record AuthSession(String token, Long userId) {}
}
