-- =============================================
-- HORSE RACING TOURNAMENT MANAGEMENT SYSTEM
-- Database: horse_racing_db
-- Author: Danh (BA) | Version: 3.0 - Mentor Reviewed
-- Changes from v2.0:
--   1. Added jockey_invitation table (manage invite flow)
--   2. Renamed registration → race_entry (more precise)
--   3. Renamed rank → finish_rank (avoid SQL keyword conflict)
--   4. Changed bet.predicted_horse_id → predicted_registration_id
--   5. Added missing UNIQUE constraints
-- =============================================

CREATE DATABASE IF NOT EXISTS horse_racing_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE horse_racing_db;

-- ============================================================
-- LUỒNG 4: AUTH & USER
-- ============================================================
CREATE TABLE `user` (
  id            BIGINT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(100)     NOT NULL UNIQUE,
  password_hash VARCHAR(255)     NOT NULL,
  full_name     VARCHAR(100)     NOT NULL,
  phone         VARCHAR(20),
  role          ENUM('HORSE_OWNER','JOCKEY','REFEREE',
                     'SPECTATOR','ADMIN')      NOT NULL,
  status        ENUM('ACTIVE','INACTIVE','BANNED') DEFAULT 'ACTIVE',
  avatar_url    VARCHAR(255),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_role   (role),
  INDEX idx_user_status (status)
) ENGINE=InnoDB;

-- 1-1 profile for Jockey only
CREATE TABLE jockey_profile (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT UNSIGNED NOT NULL UNIQUE,   -- enforces 1-1
  license_number   VARCHAR(50)     NOT NULL UNIQUE,
  weight_kg        DECIMAL(5,2),
  experience_years INT             DEFAULT 0,
  total_races      INT             DEFAULT 0,
  total_wins       INT             DEFAULT 0,
  bio              TEXT,

  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- LUỒNG 3: TOURNAMENT & RACE
-- ============================================================
CREATE TABLE tournament (
  id          BIGINT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  created_by  BIGINT UNSIGNED  NOT NULL,              -- Admin who created
  name        VARCHAR(200)     NOT NULL,
  location    VARCHAR(200),
  description TEXT,
  start_date  DATE             NOT NULL,
  end_date    DATE             NOT NULL,
  prize_pool  DECIMAL(15,2)    DEFAULT 0.00,
  max_horses  INT              DEFAULT 20,
  status      ENUM('DRAFT','OPEN','ONGOING','CLOSED') DEFAULT 'DRAFT',
  created_at  DATETIME         DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES `user`(id),
  INDEX idx_tournament_status (status),
  INDEX idx_tournament_dates  (start_date, end_date)
) ENGINE=InnoDB;

CREATE TABLE race (
  id               BIGINT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  tournament_id    BIGINT UNSIGNED  NOT NULL,
  referee_id       BIGINT UNSIGNED  NULL,
  name             VARCHAR(200)     NOT NULL,
  round_number     INT              DEFAULT 1,
  race_date        DATETIME         NOT NULL,
  distance_m       INT              NOT NULL,
  max_participants INT              DEFAULT 12,
  status           ENUM('SCHEDULED','ONGOING','FINISHED','COMPLETED')
                                    DEFAULT 'SCHEDULED',
  created_at       DATETIME         DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tournament_id) REFERENCES tournament(id) ON DELETE CASCADE,
  FOREIGN KEY (referee_id)    REFERENCES `user`(id)    ON DELETE SET NULL,

  -- UNIQUE: cùng 1 race không được đặt trùng round trong 1 tournament
  UNIQUE KEY uq_tournament_round (tournament_id, round_number),

  INDEX idx_race_tournament (tournament_id),
  INDEX idx_race_date       (race_date),
  INDEX idx_race_status     (status)
) ENGINE=InnoDB;

-- ============================================================
-- LUỒNG 1: HORSE
-- ============================================================
CREATE TABLE horse (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id    BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(100)    NOT NULL,
  breed       VARCHAR(100),
  age         INT,
  weight_kg   DECIMAL(5,2),
  color       VARCHAR(50),
  image_url   VARCHAR(255),
  total_races INT             DEFAULT 0,
  total_wins  INT             DEFAULT 0,
  status      ENUM('ACTIVE','RETIRED') DEFAULT 'ACTIVE',
  created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (owner_id) REFERENCES `user`(id) ON DELETE CASCADE,
  INDEX idx_horse_owner (owner_id)
) ENGINE=InnoDB;

-- ============================================================
-- FIX 1: NEW TABLE — jockey_invitation
-- Quản lý riêng luồng mời Jockey từ Horse Owner
-- Tách ra khỏi race_entry để mỗi entity có 1 trách nhiệm rõ ràng
-- ============================================================
CREATE TABLE jockey_invitation (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  horse_id    BIGINT UNSIGNED NOT NULL,               -- ngựa cần jockey
  owner_id    BIGINT UNSIGNED NOT NULL,               -- chủ ngựa gửi lời mời
  jockey_id   BIGINT UNSIGNED NOT NULL,               -- jockey nhận lời mời
  race_id     BIGINT UNSIGNED NOT NULL,               -- race cụ thể
  status      ENUM('PENDING','ACCEPTED','DECLINED','EXPIRED')
                              DEFAULT 'PENDING',
  message     TEXT,                                   -- lời nhắn tùy chọn
  invited_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME       NULL,
  expires_at  DATETIME        NULL,                   -- lời mời hết hạn sau X giờ

  -- UNIQUE: 1 owner chỉ mời 1 jockey cho 1 ngựa trong 1 race tại 1 thời điểm
  UNIQUE KEY uq_invite_horse_jockey_race (horse_id, jockey_id, race_id),

  FOREIGN KEY (horse_id)  REFERENCES horse(id)      ON DELETE CASCADE,
  FOREIGN KEY (owner_id)  REFERENCES `user`(id)     ON DELETE CASCADE,
  FOREIGN KEY (jockey_id) REFERENCES `user`(id)     ON DELETE CASCADE,
  FOREIGN KEY (race_id)   REFERENCES race(id)       ON DELETE CASCADE,

  INDEX idx_invitation_jockey (jockey_id),        -- Jockey xem lời mời của mình
  INDEX idx_invitation_horse  (horse_id),
  INDEX idx_invitation_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- FIX 2: RENAMED registration → race_entry
-- "race_entry" sát nghĩa hơn: một con ngựa + jockey 
--  chính thức tham gia vào 1 race cụ thể
-- ============================================================
CREATE TABLE race_entry (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  horse_id      BIGINT UNSIGNED NOT NULL,
  jockey_id     BIGINT UNSIGNED NULL,               -- confirmed sau khi invite ACCEPTED
  tournament_id BIGINT UNSIGNED NOT NULL,
  race_id       BIGINT UNSIGNED NULL,               -- gán sau khi Admin xếp lịch
  status        ENUM('PENDING','APPROVED','REJECTED','CONFIRMED')
                                DEFAULT 'PENDING',
  registered_at DATETIME        DEFAULT CURRENT_TIMESTAMP,
  approved_at   DATETIME        NULL,

  -- 1 ngựa chỉ tham gia 1 lần trong 1 tournament
  UNIQUE KEY uq_horse_tournament (horse_id, tournament_id),
  -- FIX 5: thêm UNIQUE — 1 ngựa không được vào cùng 1 race 2 lần
  -- (dùng partial index trick: chỉ enforce khi race_id NOT NULL → handle ở app layer)
  -- Thay bằng: enforce ở application + check trước khi INSERT

  FOREIGN KEY (horse_id)      REFERENCES horse(id)       ON DELETE CASCADE,
  FOREIGN KEY (jockey_id)     REFERENCES `user`(id)      ON DELETE SET NULL,
  FOREIGN KEY (tournament_id) REFERENCES tournament(id)  ON DELETE CASCADE,
  FOREIGN KEY (race_id)       REFERENCES race(id)        ON DELETE SET NULL,

  INDEX idx_entry_jockey     (jockey_id),
  INDEX idx_entry_tournament (tournament_id),
  INDEX idx_entry_race       (race_id)
) ENGINE=InnoDB;

-- ============================================================
-- RESULT & PRIZE
-- FIX 3: Đổi cột `rank` → `finish_rank` (tránh từ khóa SQL)
-- ============================================================
CREATE TABLE race_result (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  race_id         BIGINT UNSIGNED NOT NULL,
  entry_id        BIGINT UNSIGNED NOT NULL,           -- FK → race_entry (thay registration_id)
  finish_rank     INT             NOT NULL,           -- FIX 3: đổi từ `rank`
  finish_time_ms  BIGINT,
  disqualified    BOOLEAN         DEFAULT FALSE,
  violation_notes TEXT,
  recorded_at     DATETIME        DEFAULT CURRENT_TIMESTAMP,

  -- UNIQUE: trong 1 race, không có 2 entry cùng finish_rank
  UNIQUE KEY uq_race_finish_rank (race_id, finish_rank),
  -- FIX 5: UNIQUE — 1 entry chỉ có 1 kết quả trong 1 race
  UNIQUE KEY uq_race_entry       (race_id, entry_id),

  FOREIGN KEY (race_id)   REFERENCES race(id)       ON DELETE CASCADE,
  FOREIGN KEY (entry_id)  REFERENCES race_entry(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE prize (
  id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  race_id  BIGINT UNSIGNED NOT NULL,
  entry_id BIGINT UNSIGNED NOT NULL,                 -- FK → race_entry
  finish_rank INT          NOT NULL,                 -- FIX 3: đổi từ `rank`
  amount   DECIMAL(15,2)   NOT NULL,
  paid_at  DATETIME        NULL,
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,

  -- FIX 5: UNIQUE — 1 entry chỉ nhận 1 prize trong 1 race
  UNIQUE KEY uq_prize_race_entry (race_id, entry_id),

  FOREIGN KEY (race_id)  REFERENCES race(id)       ON DELETE CASCADE,
  FOREIGN KEY (entry_id) REFERENCES race_entry(id) ON DELETE CASCADE,
  INDEX idx_prize_entry  (entry_id)
) ENGINE=InnoDB;

CREATE TABLE referee_report (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  race_id      BIGINT UNSIGNED NOT NULL UNIQUE,      -- 1 race = 1 report
  referee_id   BIGINT UNSIGNED NULL,
  violations   JSON,
  notes        TEXT,
  confirmed    BOOLEAN         DEFAULT FALSE,
  confirmed_at DATETIME        NULL,

  FOREIGN KEY (race_id)    REFERENCES race(id)   ON DELETE CASCADE,
  FOREIGN KEY (referee_id) REFERENCES `user`(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- LUỒNG 2: PREDICTION / BET  ⭐ DANH 
-- FIX 4: predicted_horse_id → predicted_registration_id
--         (tham chiếu race_entry để biết chính xác horse+jockey+race)
-- ============================================================
CREATE TABLE bet (
  id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  spectator_id             BIGINT UNSIGNED NOT NULL,
  race_id                  BIGINT UNSIGNED NOT NULL,
  predicted_entry_id       BIGINT UNSIGNED NOT NULL,  -- FIX 4: → race_entry.id
  result                   ENUM('PENDING','WIN','LOSE') DEFAULT 'PENDING',
  placed_at                DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at              DATETIME NULL,

  -- FIX 5: 1 spectator chỉ đặt 1 bet cho 1 race
  UNIQUE KEY uq_spectator_race (spectator_id, race_id),
  -- FIX 5: đảm bảo predicted_entry thuộc đúng race đang bet
  -- (enforce ở application layer khi INSERT)

  FOREIGN KEY (spectator_id)       REFERENCES `user`(id)      ON DELETE CASCADE,
  FOREIGN KEY (race_id)            REFERENCES race(id)         ON DELETE CASCADE,
  FOREIGN KEY (predicted_entry_id) REFERENCES race_entry(id)  ON DELETE CASCADE,

  INDEX idx_bet_race (race_id)
) ENGINE=InnoDB;

-- ============================================================
-- NOTIFICATION  ⭐ DANH 
-- ============================================================
CREATE TABLE notification (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(200)    NOT NULL,
  message    TEXT            NOT NULL,
  type       ENUM('JOCKEY_INVITE','REG_APPROVED','REG_REJECTED',
                  'RACE_RESULT','BET_WIN','BET_LOSE','SYSTEM') NOT NULL,
  ref_id     BIGINT UNSIGNED NULL,
  ref_type   VARCHAR(50)     NULL,       -- 'RACE','BET','RACE_ENTRY','INVITATION'
  is_read    BOOLEAN         DEFAULT FALSE,
  email_sent BOOLEAN         DEFAULT FALSE,
  created_at DATETIME        DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
  INDEX idx_notification_user      (user_id),
  INDEX idx_notification_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA (minimal — for dev testing)
-- Password hash = BCrypt("password123")
-- ============================================================
INSERT INTO `user` (email, password_hash, full_name, phone, role) VALUES
('admin@racing.vn',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', 'System Admin',    '0901000001', 'ADMIN'),
('owner1@racing.vn',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', 'Nguyễn Văn An',  '0901000002', 'HORSE_OWNER'),
('jockey1@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', 'Lê Văn Cường',   '0901000003', 'JOCKEY'),
('referee@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', 'Hoàng Văn Đức',  '0901000004', 'REFEREE'),
('spec1@racing.vn',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', 'Trần Thị Mai',   '0901000005', 'SPECTATOR');

INSERT INTO jockey_profile (user_id, license_number, weight_kg, experience_years) VALUES
(3, 'JK-2024-001', 54.5, 5);

INSERT INTO horse (owner_id, name, breed, age, weight_kg, color) VALUES
(2, 'Thần Phong', 'Thoroughbred', 4, 480.0, 'Nâu đen');

INSERT INTO tournament (created_by, name, location, start_date, end_date, prize_pool, status) VALUES
(1, 'Giải Đua Mùa Xuân 2025', 'Trường đua Phú Thọ', '2025-03-01', '2025-03-31', 500000000.00, 'OPEN');

INSERT INTO race (tournament_id, referee_id, name, round_number, race_date, distance_m) VALUES
(1, 4, 'Vòng loại 1 - 1200m', 1, '2025-03-10 09:00:00', 1200);

