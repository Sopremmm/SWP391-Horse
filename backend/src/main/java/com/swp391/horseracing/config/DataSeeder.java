package com.swp391.horseracing.config;

import com.swp391.horseracing.entity.Horse;
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
        User jockey = createUser("jockey@demo.com", "123456", "Jockey Demo", "0900000004", Role.JOCKEY);
        User jockey2 = createUser("jockey2@demo.com", "123456", "Jockey Demo 2", "0900000006", Role.JOCKEY);
        User spectator = createUser("spectator@demo.com", "123456", "Spectator Demo", "0900000005", Role.SPECTATOR);

        Tournament tournament = new Tournament();
        tournament.setCreatedBy(admin);
        tournament.setName("Demo Tournament 2026");
        tournament.setLocation("HCMC");
        tournament.setDescription("Seeded data for demo");
        tournament.setStartDate(LocalDate.now().minusDays(1));
        tournament.setEndDate(LocalDate.now().plusDays(7));
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
        race.setStatus("SCHEDULED");
        Race savedRace = raceRepository.save(race);

        Horse horse = new Horse();
        horse.setOwner(owner);
        horse.setName("Thunder");
        horse.setBreed("Thoroughbred");
        horse.setAge(4);
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
        horse2.setWeightKg(440.0);
        horse2.setColor("Black");
        horse2.setImageUrl("https://images.unsplash.com/photo-1501706362039-c6e13d93b8b1");
        horse2.setStatus("ACTIVE");
        Horse savedHorse2 = horseRepository.save(horse2);

        RaceEntry entry = new RaceEntry();
        entry.setHorse(savedHorse);
        entry.setJockey(jockey);
        entry.setTournament(savedTournament);
        entry.setRace(savedRace);
        entry.setStatus("APPROVED");
        raceEntryRepository.save(entry);

        RaceEntry entry2 = new RaceEntry();
        entry2.setHorse(savedHorse2);
        entry2.setJockey(jockey2);
        entry2.setTournament(savedTournament);
        entry2.setRace(savedRace);
        entry2.setStatus("CONFIRMED");
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
}
