package com.swp391.horseracing.config;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.entity.enums.UserStatus;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.TournamentRepository;
import com.swp391.horseracing.repository.UserRepository;
import com.swp391.horseracing.repository.JockeyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Locale;

@Component
public class DataSeeder implements CommandLineRunner {
    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JockeyProfileRepository jockeyProfileRepository;

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        if (userRepository.count() > 0) {
            return;
        }

        User admin = createUser("admin@demo.com", "123456", "Admin Demo", "0900000001", Role.ADMIN);
        User referee = createUser("referee@demo.com", "123456", "Referee Demo", "0900000002", Role.REFEREE);
        User owner = createUser("owner@demo.com", "123456", "Owner Demo", "0900000003", Role.HORSE_OWNER);
        User owner2 = createUser("owner2@demo.com", "123456", "Owner Demo 2", "0900000007", Role.HORSE_OWNER);
        User owner3 = createUser("owner3@demo.com", "123456", "Owner Demo 3", "0900000008", Role.HORSE_OWNER);
        User jockey = createUser("jockey@demo.com", "123456", "Jockey Demo", "0900000004", Role.JOCKEY);
        User jockey2 = createUser("jockey2@demo.com", "123456", "Jockey Demo 2", "0900000006", Role.JOCKEY);
        User jockey3 = createUser("jockey3@demo.com", "123456", "Jockey Demo 3", "0900000009", Role.JOCKEY);
        User spectator = createUser("spectator@demo.com", "123456", "Spectator Demo", "0900000005", Role.SPECTATOR);
        createJockeyProfile(jockey, "DEMO-JKY-001");
        createJockeyProfile(jockey2, "DEMO-JKY-002");
        createJockeyProfile(jockey3, "DEMO-JKY-003");

        Tournament tournament = new Tournament();
        tournament.setCreatedBy(admin);
        tournament.setName("Demo Tournament 2026");
        tournament.setLocation("HCMC");
        tournament.setDescription("Seeded data for demo");
        tournament.setStartDate(LocalDate.now().plusDays(10));
        tournament.setEndDate(LocalDate.now().plusDays(14));
        tournament.setRegistrationStartDate(LocalDate.now().minusDays(1));
        tournament.setRegistrationEndDate(LocalDate.now().plusDays(5));
        tournament.setBracketPublished(true);
        tournament.setMaxHorses(20);
        tournament.setStatus("OPEN");
        Tournament savedTournament = tournamentRepository.save(tournament);

        Race race = new Race();
        race.setTournament(savedTournament);
        race.setReferee(referee);
        race.setName("Round 1 - 1200m");
        race.setRoundNumber(1);
        race.setRaceDate(LocalDateTime.now().plusDays(1));
        race.setDistanceM(1200);
        race.setMaxParticipants(12);
        race.setGatesConfigured(true);
        race.setPublished(true);
        race.setStatus("SCHEDULED");
        Race savedRace = raceRepository.save(race);

        Horse horse = new Horse();
        horse.setOwner(owner);
        horse.setName("Thunder");
        horse.setBreed("Thoroughbred");
        horse.setAge(4);
        horse.setAgeType("Stallion");
        horse.setWeightKg(450.0);
        horse.setColor("Brown");
        horse.setImageUrl("https://images.unsplash.com/photo-1517849845537-4d257902454a");
        horse.setStatus("ACTIVE");
        Horse savedHorse = horseRepository.save(horse);

        Horse horse2 = new Horse();
        horse2.setOwner(owner);
        horse2.setName("Lightning");
        horse2.setBreed("Arabian");
        horse2.setAge(5);
        horse2.setAgeType("Mare");
        horse2.setWeightKg(440.0);
        horse2.setColor("Black");
        horse2.setImageUrl("https://images.unsplash.com/photo-1501706362039-c6e13d93b8b1");
        horse2.setStatus("ACTIVE");
        Horse savedHorse2 = horseRepository.save(horse2);

        createHorse(owner, "Demo Star", "Thoroughbred", 4, "Colt", 455.0, "Chestnut");
        createHorse(owner, "Silver Comet", "Warmblood", 5, "Gelding", 470.0, "Grey");
        createHorse(owner, "Iron Duke", "Thoroughbred", 6, "Stallion", 490.0, "Bay");
        createHorse(owner2, "Velvet Queen", "Arabian", 5, "Mare", 435.0, "Black");
        createHorse(owner2, "Golden Arrow", "Thoroughbred", 4, "Gelding", 465.0, "Palomino");
        createHorse(owner3, "Desert Wind", "Arabian", 6, "Stallion", 450.0, "Chestnut");
        createHorse(owner3, "Northern Star", "Warmblood", 4, "Mare", 460.0, "Grey");

        RaceEntry entry = new RaceEntry();
        entry.setHorse(savedHorse);
        entry.setJockey(jockey);
        entry.setTournament(savedTournament);
        entry.setRace(savedRace);
        entry.setStatus("APPROVED");
        entry.setGateNumber(1);
        raceEntryRepository.save(entry);

        RaceEntry entry2 = new RaceEntry();
        entry2.setHorse(savedHorse2);
        entry2.setJockey(jockey2);
        entry2.setTournament(savedTournament);
        entry2.setRace(savedRace);
        entry2.setStatus("APPROVED");
        entry2.setGateNumber(2);
        raceEntryRepository.save(entry2);
    }

    private User createUser(String email, String password, String fullName, String phone, Role role) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase(Locale.ROOT);
        User u = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .phone(phone)
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();
        return userRepository.save(u);
    }

    private void createJockeyProfile(User user, String license) {
        JockeyProfile profile = new JockeyProfile();
        profile.setUser(user);
        profile.setLicenseNumber(license);
        profile.setWeightKg(55.0);
        profile.setExperienceYears(2);
        profile.setActive(true);
        jockeyProfileRepository.save(profile);
    }

    private Horse createHorse(User owner, String name, String breed, int age, String ageType, double weightKg, String color) {
        Horse horse = new Horse();
        horse.setOwner(owner);
        horse.setName(name);
        horse.setBreed(breed);
        horse.setAge(age);
        horse.setAgeType(ageType);
        horse.setWeightKg(weightKg);
        horse.setColor(color);
        horse.setStatus("ACTIVE");
        return horseRepository.save(horse);
    }
}
