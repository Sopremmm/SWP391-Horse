-- ============================================= -- HORSE RACING - SQL Server (Danh FIXED) -- =============================================

USE master; GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'horse_racing_db') DROP DATABASE horse_racing_db; GO

CREATE DATABASE horse_racing_db; GO

USE horse_racing_db; GO

-- ============================================================ -- USER -- ============================================================ 
CREATE TABLE [user] ( id BIGINT IDENTITY(1,1) PRIMARY KEY, email VARCHAR(100) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, full_name NVARCHAR(100) NOT NULL, phone VARCHAR(20), role VARCHAR(20) NOT NULL CHECK (role IN ('HORSE_OWNER','JOCKEY','REFEREE','SPECTATOR','ADMIN')), status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','BANNED')), avatar_url VARCHAR(255), created_at DATETIME2 DEFAULT GETDATE(), updated_at DATETIME2 DEFAULT GETDATE() ); GO

CREATE TRIGGER trg_user_updated_at ON [user] AFTER UPDATE AS BEGIN UPDATE u SET updated_at = GETDATE() FROM [user] u INNER JOIN inserted i ON u.id = i.id; END; GO

-- ============================================================ -- JOCKEY PROFILE -- ============================================================ 
  CREATE TABLE jockey_profile ( id BIGINT IDENTITY(1,1) PRIMARY KEY, user_id BIGINT NOT NULL UNIQUE, license_number VARCHAR(50) NOT NULL UNIQUE, weight_kg DECIMAL(5,2), experience_years INT DEFAULT 0, total_races INT DEFAULT 0, total_wins INT DEFAULT 0, bio NVARCHAR(MAX), FOREIGN KEY (user_id) REFERENCES user ON DELETE CASCADE ); GO

-- ============================================================ -- TOURNAMENT & RACE -- ============================================================ 
  CREATE TABLE tournament ( id BIGINT IDENTITY(1,1) PRIMARY KEY, created_by BIGINT NOT NULL, name NVARCHAR(200) NOT NULL, location NVARCHAR(200), description NVARCHAR(MAX), start_date DATE NOT NULL, end_date DATE NOT NULL, prize_pool DECIMAL(15,2) DEFAULT 0.00, max_horses INT DEFAULT 20, status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','OPEN','ONGOING','CLOSED')), created_at DATETIME2 DEFAULT GETDATE(), FOREIGN KEY (created_by) REFERENCES user ON DELETE NO ACTION ); GO

CREATE TABLE race ( id BIGINT IDENTITY(1,1) PRIMARY KEY, tournament_id BIGINT NOT NULL, referee_id BIGINT NULL, name NVARCHAR(200) NOT NULL, round_number INT DEFAULT 1, race_date DATETIME2 NOT NULL, distance_m INT NOT NULL, max_participants INT DEFAULT 12, status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED','ONGOING','FINISHED','COMPLETED')), created_at DATETIME2 DEFAULT GETDATE(), FOREIGN KEY (tournament_id) REFERENCES tournament(id) ON DELETE CASCADE, FOREIGN KEY (referee_id) REFERENCES user ON DELETE SET NULL, CONSTRAINT uq_tournament_round UNIQUE (tournament_id, round_number) ); GO

-- ============================================================ -- HORSE -- ============================================================ 
  CREATE TABLE horse ( id BIGINT IDENTITY(1,1) PRIMARY KEY, owner_id BIGINT NOT NULL, name NVARCHAR(100) NOT NULL, breed NVARCHAR(100), age INT, weight_kg DECIMAL(5,2), color NVARCHAR(50), image_url VARCHAR(255), total_races INT DEFAULT 0, total_wins INT DEFAULT 0, status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','RETIRED')), created_at DATETIME2 DEFAULT GETDATE(), FOREIGN KEY (owner_id) REFERENCES user ON DELETE NO ACTION ); GO

-- ============================================================ -- JOCKEY INVITATION -- ============================================================ 
  CREATE TABLE jockey_invitation ( id BIGINT IDENTITY(1,1) PRIMARY KEY, horse_id BIGINT NOT NULL, owner_id BIGINT NOT NULL, jockey_id BIGINT NOT NULL, race_id BIGINT NOT NULL, status VARCHAR(15) DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','DECLINED','EXPIRED')), message NVARCHAR(MAX), invited_at DATETIME2 DEFAULT GETDATE(), responded_at DATETIME2 NULL, expires_at DATETIME2 NULL, CONSTRAINT uq_invite_horse_jockey_race UNIQUE (horse_id, jockey_id, race_id), FOREIGN KEY (horse_id) REFERENCES horse(id) ON DELETE CASCADE, FOREIGN KEY (owner_id) REFERENCES user ON DELETE NO ACTION, FOREIGN KEY (jockey_id) REFERENCES user ON DELETE NO ACTION, FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE ); GO

-- ============================================================ -- RACE ENTRY - ĐÃ SỬA CASCADE Ở ĐÂY -- ============================================================ 
  CREATE TABLE race_entry ( id BIGINT IDENTITY(1,1) PRIMARY KEY, horse_id BIGINT NOT NULL, jockey_id BIGINT NULL, tournament_id BIGINT NOT NULL, race_id BIGINT NULL, status VARCHAR(15) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CONFIRMED')), registered_at DATETIME2 DEFAULT GETDATE(), approved_at DATETIME2 NULL, CONSTRAINT uq_horse_tournament UNIQUE (horse_id, tournament_id), FOREIGN KEY (horse_id) REFERENCES horse(id) ON DELETE NO ACTION, FOREIGN KEY (jockey_id) REFERENCES user ON DELETE SET NULL, FOREIGN KEY (tournament_id) REFERENCES tournament(id) ON DELETE NO ACTION, 
  -- ← SỬA Ở ĐÂY FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE SET NULL ); GO

-- ============================================================ -- RACE RESULT, PRIZE, BET -- ============================================================ 
  CREATE TABLE race_result ( id BIGINT IDENTITY(1,1) PRIMARY KEY, race_id BIGINT NOT NULL, entry_id BIGINT NOT NULL, finish_rank INT NOT NULL, finish_time_ms BIGINT, disqualified BIT DEFAULT 0, violation_notes NVARCHAR(MAX), recorded_at DATETIME2 DEFAULT GETDATE(), CONSTRAINT uq_race_finish_rank UNIQUE (race_id, finish_rank), CONSTRAINT uq_race_entry UNIQUE (race_id, entry_id), FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE, FOREIGN KEY (entry_id) REFERENCES race_entry(id) ON DELETE CASCADE ); GO

CREATE TABLE prize ( id BIGINT IDENTITY(1,1) PRIMARY KEY, race_id BIGINT NOT NULL, entry_id BIGINT NOT NULL, finish_rank INT NOT NULL, amount DECIMAL(15,2) NOT NULL, paid_at DATETIME2 NULL, created_at DATETIME2 DEFAULT GETDATE(), CONSTRAINT uq_prize_race_entry UNIQUE (race_id, entry_id), FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE, FOREIGN KEY (entry_id) REFERENCES race_entry(id) ON DELETE CASCADE ); GO

CREATE TABLE referee_report ( id BIGINT IDENTITY(1,1) PRIMARY KEY, race_id BIGINT NOT NULL UNIQUE, referee_id BIGINT NULL, violations NVARCHAR(MAX), notes NVARCHAR(MAX), confirmed BIT DEFAULT 0, confirmed_at DATETIME2 NULL, FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE, FOREIGN KEY (referee_id) REFERENCES user ON DELETE SET NULL ); GO

CREATE TABLE bet ( id BIGINT IDENTITY(1,1) PRIMARY KEY, spectator_id BIGINT NOT NULL, race_id BIGINT NOT NULL, predicted_entry_id BIGINT NOT NULL, result VARCHAR(10) DEFAULT 'PENDING' CHECK (result IN ('PENDING','WIN','LOSE')), placed_at DATETIME2 DEFAULT GETDATE(), resolved_at DATETIME2 NULL, CONSTRAINT uq_spectator_race UNIQUE (spectator_id, race_id), FOREIGN KEY (spectator_id) REFERENCES user ON DELETE NO ACTION, FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE, FOREIGN KEY (predicted_entry_id) REFERENCES race_entry(id) ON DELETE CASCADE ); GO

CREATE TABLE notification ( id BIGINT IDENTITY(1,1) PRIMARY KEY, user_id BIGINT NOT NULL, title NVARCHAR(200) NOT NULL, message NVARCHAR(MAX) NOT NULL, type VARCHAR(30) NOT NULL CHECK (type IN ('JOCKEY_INVITE','REG_APPROVED','REG_REJECTED', 'RACE_RESULT','BET_WIN','BET_LOSE','SYSTEM')), ref_id BIGINT NULL, ref_type VARCHAR(50) NULL, is_read BIT DEFAULT 0, email_sent BIT DEFAULT 0, created_at DATETIME2 DEFAULT GETDATE(), FOREIGN KEY (user_id) REFERENCES user ON DELETE CASCADE ); GO

-- ============================================================ -- SEED DATA -- ============================================================ 
  INSERT INTO [user] (email, password_hash, full_name, phone, role) VALUES ('admin@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', N'System Admin', '0901000001', 'ADMIN'), ('owner1@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', N'Nguyễn Văn An', '0901000002', 'HORSE_OWNER'), ('jockey1@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', N'Lê Văn Cường', '0901000003', 'JOCKEY'), ('referee@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', N'Hoàng Văn Đức', '0901000004', 'REFEREE'), ('spec1@racing.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyLZI9tji', N'Trần Thị Mai', '0901000005', 'SPECTATOR'); GO

INSERT INTO jockey_profile (user_id, license_number, weight_kg, experience_years) VALUES (3, 'JK-2024-001', 54.5, 5); GO

INSERT INTO horse (owner_id, name, breed, age, weight_kg, color) VALUES (2, N'Thần Phong', 'Thoroughbred', 4, 480.0, N'Nâu đen'); GO

INSERT INTO tournament (created_by, name, location, start_date, end_date, prize_pool, status) VALUES (1, N'Giải Đua Mùa Xuân 2025', N'Trường đua Phú Thọ', '2025-03-01', '2025-03-31', 500000000.00, 'OPEN'); GO

INSERT INTO race (tournament_id, referee_id, name, round_number, race_date, distance_m) VALUES (1, 4, N'Vòng loại 1 - 1200m', 1, '2025-03-10 09:00:00', 1200); GO

PRINT ' Database horse_racing_db da tao THANH CONG (Full Fixed)!';
