/*
  Horse Racing Management - official one-file local/demo database setup.
  Run with SQL Server / sqlcmd. The script never drops an existing database.
  On a fresh machine it creates HorseRacingManagement, all tables and demo data.
*/
USE [master];
GO

IF DB_ID(N'HorseRacingManagement') IS NULL
    CREATE DATABASE [HorseRacingManagement];
GO

USE [HorseRacingManagement];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET NUMERIC_ROUNDABORT OFF;
GO

/* Core tables. IF guards make the script safe to re-run on a local demo DB. */
IF OBJECT_ID(N'dbo.[user]', N'U') IS NULL
CREATE TABLE dbo.[user] (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_user PRIMARY KEY,
    email VARCHAR(100) NOT NULL CONSTRAINT UQ_user_email UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(200) NOT NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL CONSTRAINT CK_user_role CHECK (role IN ('ADMIN','HORSE_OWNER','JOCKEY','REFEREE','SPECTATOR')),
    status VARCHAR(10) NOT NULL CONSTRAINT DF_user_status DEFAULT 'ACTIVE' CONSTRAINT CK_user_status CHECK (status IN ('ACTIVE','INACTIVE','BANNED')),
    avatar_url NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_user_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_user_updated_at DEFAULT SYSUTCDATETIME(),
    balance DECIMAL(15,2) NOT NULL CONSTRAINT DF_user_balance DEFAULT 0
);

IF OBJECT_ID(N'dbo.tournament', N'U') IS NULL
CREATE TABLE dbo.tournament (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tournament PRIMARY KEY,
    created_by BIGINT NOT NULL CONSTRAINT FK_tournament_created_by FOREIGN KEY REFERENCES dbo.[user](id),
    name NVARCHAR(200) NOT NULL,
    location NVARCHAR(200) NULL,
    description VARCHAR(MAX) NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start_date DATE NULL,
    registration_end_date DATE NULL,
    prize_pool DECIMAL(15,2) NOT NULL CONSTRAINT DF_tournament_prize_pool DEFAULT 0,
    max_horses INT NOT NULL CONSTRAINT DF_tournament_max_horses DEFAULT 20,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_tournament_status DEFAULT 'DRAFT' CONSTRAINT CK_tournament_status CHECK (status IN ('DRAFT','OPEN','ONGOING','CLOSED','FINISHED')),
    created_at DATETIME2 NOT NULL CONSTRAINT DF_tournament_created_at DEFAULT SYSUTCDATETIME(),
    image_url NVARCHAR(MAX) NULL,
    bracket_published BIT NOT NULL CONSTRAINT DF_tournament_bracket_published DEFAULT 0
);

IF OBJECT_ID(N'dbo.horse', N'U') IS NULL
CREATE TABLE dbo.horse (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_horse PRIMARY KEY,
    owner_id BIGINT NOT NULL CONSTRAINT FK_horse_owner FOREIGN KEY REFERENCES dbo.[user](id),
    name NVARCHAR(200) NOT NULL,
    breed NVARCHAR(200) NULL,
    age INT NULL,
    age_type NVARCHAR(100) NULL,
    image_url NVARCHAR(MAX) NULL,
    total_races INT NOT NULL CONSTRAINT DF_horse_total_races DEFAULT 0,
    total_wins INT NOT NULL CONSTRAINT DF_horse_total_wins DEFAULT 0,
    status VARCHAR(10) NOT NULL CONSTRAINT DF_horse_status DEFAULT 'ACTIVE' CONSTRAINT CK_horse_status CHECK (status IN ('ACTIVE','RETIRED')),
    created_at DATETIME2 NOT NULL CONSTRAINT DF_horse_created_at DEFAULT SYSUTCDATETIME(),
    color NVARCHAR(100) NULL,
    weight_kg FLOAT NULL
);

IF OBJECT_ID(N'dbo.jockey_profile', N'U') IS NULL
CREATE TABLE dbo.jockey_profile (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_jockey_profile PRIMARY KEY,
    user_id BIGINT NOT NULL CONSTRAINT UQ_jockey_profile_user UNIQUE CONSTRAINT FK_jockey_profile_user FOREIGN KEY REFERENCES dbo.[user](id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL CONSTRAINT UQ_jockey_profile_license UNIQUE,
    weight_kg FLOAT NULL,
    age INT NULL,
    gender VARCHAR(20) NULL,
    invitation_rate DECIMAL(15,2) NULL,
    international_travel BIT NOT NULL CONSTRAINT DF_jockey_profile_international_travel DEFAULT 0,
    experience_years INT NOT NULL CONSTRAINT DF_jockey_profile_experience DEFAULT 0,
    total_races INT NOT NULL CONSTRAINT DF_jockey_profile_races DEFAULT 0,
    total_wins INT NOT NULL CONSTRAINT DF_jockey_profile_wins DEFAULT 0,
    bio VARCHAR(MAX) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_jockey_profile_active DEFAULT 0
);

IF OBJECT_ID(N'dbo.race', N'U') IS NULL
CREATE TABLE dbo.race (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_race PRIMARY KEY,
    tournament_id BIGINT NOT NULL CONSTRAINT FK_race_tournament FOREIGN KEY REFERENCES dbo.tournament(id) ON DELETE CASCADE,
    referee_id BIGINT NULL CONSTRAINT FK_race_referee FOREIGN KEY REFERENCES dbo.[user](id) ON DELETE SET NULL,
    name NVARCHAR(200) NOT NULL,
    round_number INT NOT NULL CONSTRAINT DF_race_round_number DEFAULT 1,
    race_date DATETIME2 NOT NULL,
    distance_m INT NOT NULL,
    max_participants INT NOT NULL CONSTRAINT DF_race_max_participants DEFAULT 12,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_race_status DEFAULT 'SCHEDULED' CONSTRAINT CK_race_status CHECK (status IN ('SCHEDULED','ONGOING','COMPLETED','FINISHED')),
    created_at DATETIME2 NOT NULL CONSTRAINT DF_race_created_at DEFAULT SYSUTCDATETIME(),
    gates_configured BIT NOT NULL CONSTRAINT DF_race_gates_configured DEFAULT 0,
    published BIT NOT NULL CONSTRAINT DF_race_published DEFAULT 0
);

IF OBJECT_ID(N'dbo.race_entry', N'U') IS NULL
CREATE TABLE dbo.race_entry (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_race_entry PRIMARY KEY,
    horse_id BIGINT NOT NULL CONSTRAINT FK_race_entry_horse FOREIGN KEY REFERENCES dbo.horse(id),
    jockey_id BIGINT NULL CONSTRAINT FK_race_entry_jockey FOREIGN KEY REFERENCES dbo.[user](id) ON DELETE SET NULL,
    tournament_id BIGINT NOT NULL CONSTRAINT FK_race_entry_tournament FOREIGN KEY REFERENCES dbo.tournament(id),
    race_id BIGINT NULL CONSTRAINT FK_race_entry_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE SET NULL,
    status VARCHAR(15) NOT NULL CONSTRAINT DF_race_entry_status DEFAULT 'PENDING' CONSTRAINT CK_race_entry_status CHECK (status IN ('PENDING','APPROVED','REJECTED','CONFIRMED','WITHDRAWN','ELIMINATED')),
    registered_at DATETIME2 NOT NULL CONSTRAINT DF_race_entry_registered_at DEFAULT SYSUTCDATETIME(),
    approved_at DATETIME2 NULL,
    gate_number INT NULL,
    checked_in BIT NOT NULL CONSTRAINT DF_race_entry_checked_in DEFAULT 0,
    checked_in_at DATETIME2 NULL,
    no_show BIT NOT NULL CONSTRAINT DF_race_entry_no_show DEFAULT 0,
    no_show_at DATETIME2 NULL,
    rejection_reason NVARCHAR(2000) NULL,
    CONSTRAINT UQ_race_entry_horse_tournament UNIQUE (horse_id, tournament_id)
);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.race_entry') AND name = N'UX_race_entry_race_gate')
    CREATE UNIQUE NONCLUSTERED INDEX UX_race_entry_race_gate ON dbo.race_entry(race_id, gate_number) WHERE race_id IS NOT NULL AND gate_number IS NOT NULL;

IF OBJECT_ID(N'dbo.race_result', N'U') IS NULL
CREATE TABLE dbo.race_result (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_race_result PRIMARY KEY,
    race_id BIGINT NOT NULL CONSTRAINT FK_race_result_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE CASCADE,
    entry_id BIGINT NOT NULL CONSTRAINT FK_race_result_entry FOREIGN KEY REFERENCES dbo.race_entry(id) ON DELETE CASCADE,
    finish_rank INT NOT NULL,
    finish_time_ms BIGINT NULL,
    disqualified BIT NOT NULL CONSTRAINT DF_race_result_disqualified DEFAULT 0,
    violation_notes VARCHAR(MAX) NULL,
    recorded_at DATETIME2 NOT NULL CONSTRAINT DF_race_result_recorded_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_race_result_entry UNIQUE (race_id, entry_id),
    CONSTRAINT UQ_race_result_rank UNIQUE (race_id, finish_rank)
);

IF OBJECT_ID(N'dbo.referee_report', N'U') IS NULL
CREATE TABLE dbo.referee_report (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_referee_report PRIMARY KEY,
    race_id BIGINT NOT NULL CONSTRAINT UQ_referee_report_race UNIQUE CONSTRAINT FK_referee_report_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE CASCADE,
    referee_id BIGINT NULL CONSTRAINT FK_referee_report_referee FOREIGN KEY REFERENCES dbo.[user](id) ON DELETE SET NULL,
    violations VARCHAR(MAX) NULL,
    notes VARCHAR(MAX) NULL,
    confirmed BIT NOT NULL CONSTRAINT DF_referee_report_confirmed DEFAULT 0,
    confirmed_at DATETIME2 NULL,
    submitted BIT NOT NULL CONSTRAINT DF_referee_report_submitted DEFAULT 0,
    submitted_at DATETIME2 NULL
);

IF OBJECT_ID(N'dbo.jockey_invitation', N'U') IS NULL
CREATE TABLE dbo.jockey_invitation (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_jockey_invitation PRIMARY KEY,
    horse_id BIGINT NOT NULL CONSTRAINT FK_jockey_invitation_horse FOREIGN KEY REFERENCES dbo.horse(id) ON DELETE CASCADE,
    owner_id BIGINT NOT NULL CONSTRAINT FK_jockey_invitation_owner FOREIGN KEY REFERENCES dbo.[user](id),
    jockey_id BIGINT NOT NULL CONSTRAINT FK_jockey_invitation_jockey FOREIGN KEY REFERENCES dbo.[user](id),
    race_id BIGINT NOT NULL CONSTRAINT FK_jockey_invitation_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE CASCADE,
    status VARCHAR(15) NOT NULL CONSTRAINT DF_jockey_invitation_status DEFAULT 'PENDING' CONSTRAINT CK_jockey_invitation_status CHECK (status IN ('PENDING','ACCEPTED','DECLINED','EXPIRED')),
    message VARCHAR(MAX) NULL,
    invited_at DATETIME2 NOT NULL CONSTRAINT DF_jockey_invitation_invited_at DEFAULT SYSUTCDATETIME(),
    responded_at DATETIME2 NULL,
    expires_at DATETIME2 NULL,
    CONSTRAINT UQ_jockey_invitation UNIQUE (horse_id, jockey_id, race_id)
);

IF OBJECT_ID(N'dbo.notification', N'U') IS NULL
CREATE TABLE dbo.notification (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_notification PRIMARY KEY,
    user_id BIGINT NOT NULL CONSTRAINT FK_notification_user FOREIGN KEY REFERENCES dbo.[user](id) ON DELETE CASCADE,
    title NVARCHAR(400) NOT NULL,
    message VARCHAR(MAX) NULL,
    type VARCHAR(30) NOT NULL CONSTRAINT CK_notification_type CHECK (type IN ('SYSTEM','RACE_RESULT','REG_REJECTED','REG_APPROVED','JOCKEY_INVITE')),
    ref_id BIGINT NULL,
    ref_type VARCHAR(50) NULL,
    is_read BIT NOT NULL CONSTRAINT DF_notification_is_read DEFAULT 0,
    email_sent BIT NOT NULL CONSTRAINT DF_notification_email_sent DEFAULT 0,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_notification_created_at DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID(N'dbo.audit_log', N'U') IS NULL
CREATE TABLE dbo.audit_log (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_audit_log PRIMARY KEY,
    actor_user_id BIGINT NOT NULL CONSTRAINT FK_audit_log_actor FOREIGN KEY REFERENCES dbo.[user](id),
    action VARCHAR(50) NOT NULL,
    ref_type VARCHAR(50) NULL,
    ref_id BIGINT NULL,
    details NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_audit_log_created_at DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID(N'dbo.bet', N'U') IS NULL
CREATE TABLE dbo.bet (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_bet PRIMARY KEY,
    spectator_id BIGINT NOT NULL CONSTRAINT FK_bet_spectator FOREIGN KEY REFERENCES dbo.[user](id),
    race_id BIGINT NOT NULL CONSTRAINT FK_bet_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE CASCADE,
    predicted_entry_id BIGINT NOT NULL CONSTRAINT FK_bet_entry FOREIGN KEY REFERENCES dbo.race_entry(id) ON DELETE CASCADE,
    result VARCHAR(10) NOT NULL CONSTRAINT DF_bet_result DEFAULT 'PENDING' CONSTRAINT CK_bet_result CHECK (result IN ('PENDING','WIN','LOSE')),
    placed_at DATETIME2 NOT NULL CONSTRAINT DF_bet_placed_at DEFAULT SYSUTCDATETIME(),
    resolved_at DATETIME2 NULL,
    CONSTRAINT UQ_bet_spectator_race UNIQUE (spectator_id, race_id)
);

IF OBJECT_ID(N'dbo.prize', N'U') IS NULL
CREATE TABLE dbo.prize (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_prize PRIMARY KEY,
    race_id BIGINT NOT NULL CONSTRAINT FK_prize_race FOREIGN KEY REFERENCES dbo.race(id) ON DELETE CASCADE,
    entry_id BIGINT NOT NULL CONSTRAINT FK_prize_entry FOREIGN KEY REFERENCES dbo.race_entry(id) ON DELETE CASCADE,
    finish_rank INT NOT NULL,
    amount DECIMAL(38,2) NULL,
    paid_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_prize_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_prize_race_entry UNIQUE (race_id, entry_id)
);

IF OBJECT_ID(N'dbo.topup_request', N'U') IS NULL
CREATE TABLE dbo.topup_request (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_topup_request PRIMARY KEY,
    user_id BIGINT NOT NULL CONSTRAINT FK_topup_request_user FOREIGN KEY REFERENCES dbo.[user](id),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_topup_request_status DEFAULT 'PENDING' CONSTRAINT CK_topup_request_status CHECK (status IN ('PENDING','PAID','EXPIRED','CANCELLED')),
    reference VARCHAR(64) NOT NULL CONSTRAINT UQ_topup_request_reference UNIQUE,
    bank_txn_id VARCHAR(64) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_topup_request_created_at DEFAULT SYSUTCDATETIME(),
    paid_at DATETIME2 NULL
);

/* Upgrade the former exported schema too, so this remains the only script
   needed even when a teammate already created the old local database. */
IF COL_LENGTH(N'dbo.tournament', N'bracket_published') IS NULL
    ALTER TABLE dbo.tournament ADD bracket_published BIT NOT NULL CONSTRAINT DF_tournament_bracket_published_upgrade DEFAULT 0;
IF COL_LENGTH(N'dbo.race', N'gates_configured') IS NULL
    ALTER TABLE dbo.race ADD gates_configured BIT NOT NULL CONSTRAINT DF_race_gates_configured_upgrade DEFAULT 0;
IF COL_LENGTH(N'dbo.race', N'published') IS NULL
    ALTER TABLE dbo.race ADD published BIT NOT NULL CONSTRAINT DF_race_published_upgrade DEFAULT 0;
IF COL_LENGTH(N'dbo.race_entry', N'rejection_reason') IS NULL
    ALTER TABLE dbo.race_entry ADD rejection_reason NVARCHAR(2000) NULL;
IF COL_LENGTH(N'dbo.jockey_profile', N'is_active') IS NULL
    ALTER TABLE dbo.jockey_profile ADD is_active BIT NOT NULL CONSTRAINT DF_jockey_profile_active_upgrade DEFAULT 0;
IF COL_LENGTH(N'dbo.referee_report', N'submitted') IS NULL
    ALTER TABLE dbo.referee_report ADD submitted BIT NOT NULL CONSTRAINT DF_referee_report_submitted_upgrade DEFAULT 0;
IF COL_LENGTH(N'dbo.referee_report', N'submitted_at') IS NULL
    ALTER TABLE dbo.referee_report ADD submitted_at DATETIME2 NULL;

DECLARE @DropLegacyStatusChecks NVARCHAR(MAX) = N'';
SELECT @DropLegacyStatusChecks = STRING_AGG(CAST(
    N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + N'.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
    N' DROP CONSTRAINT ' + QUOTENAME(name) AS NVARCHAR(MAX)), N'; ')
FROM sys.check_constraints
WHERE parent_object_id IN (OBJECT_ID(N'dbo.tournament'), OBJECT_ID(N'dbo.race_entry'))
  AND definition LIKE N'%status%';
IF LEN(@DropLegacyStatusChecks) > 0 EXEC sp_executesql @DropLegacyStatusChecks;

ALTER TABLE dbo.tournament WITH CHECK ADD CONSTRAINT CK_tournament_status_workflow CHECK (status IN ('DRAFT','OPEN','ONGOING','CLOSED','FINISHED'));
ALTER TABLE dbo.race_entry WITH CHECK ADD CONSTRAINT CK_race_entry_status_workflow CHECK (status IN ('PENDING','APPROVED','REJECTED','CONFIRMED','WITHDRAWN','ELIMINATED'));
GO

BEGIN TRANSACTION;

/* BCrypt hash for the local-only demo password: 123456 */
DECLARE @PasswordHash VARCHAR(255) = '$2b$12$KGF4J2UQoi5OIyjycsa25.zEokkDGOga6KgoL/fRx.c2kWw8hnKMa';
DECLARE @Users TABLE (email VARCHAR(100) PRIMARY KEY, full_name NVARCHAR(200), phone VARCHAR(20), role VARCHAR(20));
INSERT INTO @Users VALUES
('admin@demo.com',N'Admin Demo','0900000001','ADMIN'),('referee@demo.com',N'Referee Demo','0900000002','REFEREE'),
('owner@demo.com',N'Owner Demo','0900000003','HORSE_OWNER'),('owner2@demo.com',N'Owner Demo 2','0900000007','HORSE_OWNER'),
('owner3@demo.com',N'Owner Demo 3','0900000008','HORSE_OWNER'),('jockey@demo.com',N'Jockey Demo','0900000004','JOCKEY'),
('jockey2@demo.com',N'Jockey Demo 2','0900000006','JOCKEY'),('jockey3@demo.com',N'Jockey Demo 3','0900000009','JOCKEY'),
('spectator@demo.com',N'Spectator Demo','0900000005','SPECTATOR');
INSERT dbo.[user](email,password_hash,full_name,phone,role,status,balance)
SELECT email,@PasswordHash,full_name,phone,role,'ACTIVE',0 FROM @Users s WHERE NOT EXISTS(SELECT 1 FROM dbo.[user] u WHERE u.email=s.email);

DECLARE @Admin BIGINT=(SELECT id FROM dbo.[user] WHERE email='admin@demo.com'), @Ref BIGINT=(SELECT id FROM dbo.[user] WHERE email='referee@demo.com'), @Owner BIGINT=(SELECT id FROM dbo.[user] WHERE email='owner@demo.com'), @Owner2 BIGINT=(SELECT id FROM dbo.[user] WHERE email='owner2@demo.com'), @Owner3 BIGINT=(SELECT id FROM dbo.[user] WHERE email='owner3@demo.com'), @Jockey BIGINT=(SELECT id FROM dbo.[user] WHERE email='jockey@demo.com'), @Jockey2 BIGINT=(SELECT id FROM dbo.[user] WHERE email='jockey2@demo.com'), @Jockey3 BIGINT=(SELECT id FROM dbo.[user] WHERE email='jockey3@demo.com');

INSERT dbo.jockey_profile(user_id,license_number,weight_kg,experience_years,is_active)
SELECT v.user_id,v.license,55,2,1 FROM (VALUES(@Jockey,'DEMO-JKY-001'),(@Jockey2,'DEMO-JKY-002'),(@Jockey3,'DEMO-JKY-003'))v(user_id,license) WHERE NOT EXISTS(SELECT 1 FROM dbo.jockey_profile p WHERE p.user_id=v.user_id);

DECLARE @Horses TABLE(owner_id BIGINT,name NVARCHAR(200),breed NVARCHAR(200),age INT,age_type NVARCHAR(100),color NVARCHAR(100),weight FLOAT);
INSERT @Horses VALUES
(@Owner,N'Thunder',N'Thoroughbred',4,N'Stallion',N'Brown',450),(@Owner,N'Lightning',N'Arabian',5,N'Mare',N'Black',440),(@Owner,N'Demo Star',N'Thoroughbred',4,N'Colt',N'Chestnut',455),(@Owner,N'Silver Comet',N'Warmblood',5,N'Gelding',N'Grey',470),(@Owner,N'Iron Duke',N'Thoroughbred',6,N'Stallion',N'Bay',490),(@Owner2,N'Velvet Queen',N'Arabian',5,N'Mare',N'Black',435),(@Owner2,N'Golden Arrow',N'Thoroughbred',4,N'Gelding',N'Palomino',465),(@Owner3,N'Desert Wind',N'Arabian',6,N'Stallion',N'Chestnut',450),(@Owner3,N'Northern Star',N'Warmblood',4,N'Mare',N'Grey',460);
INSERT dbo.horse(owner_id,name,breed,age,age_type,color,weight_kg,status)
SELECT owner_id,name,breed,age,age_type,color,weight,'ACTIVE' FROM @Horses s WHERE NOT EXISTS(SELECT 1 FROM dbo.horse h WHERE h.owner_id=s.owner_id AND h.name=s.name);

IF NOT EXISTS(SELECT 1 FROM dbo.tournament WHERE name=N'Demo Tournament 2026')
INSERT dbo.tournament(created_by,name,location,description,start_date,end_date,registration_start_date,registration_end_date,prize_pool,max_horses,status,bracket_published)
VALUES(@Admin,N'Demo Tournament 2026',N'HCMC','Primary end-to-end demo tournament.',DATEADD(DAY,7,CAST(GETDATE() AS DATE)),DATEADD(DAY,11,CAST(GETDATE() AS DATE)),DATEADD(DAY,-1,CAST(GETDATE() AS DATE)),DATEADD(DAY,4,CAST(GETDATE() AS DATE)),5000000,20,'OPEN',1);
IF NOT EXISTS(SELECT 1 FROM dbo.tournament WHERE name=N'Results Showcase 2026')
INSERT dbo.tournament(created_by,name,location,description,start_date,end_date,registration_start_date,registration_end_date,prize_pool,max_horses,status,bracket_published)
VALUES(@Admin,N'Results Showcase 2026',N'HCMC','Read-only completed sample with published results.',DATEADD(DAY,-14,CAST(GETDATE() AS DATE)),DATEADD(DAY,-10,CAST(GETDATE() AS DATE)),DATEADD(DAY,-21,CAST(GETDATE() AS DATE)),DATEADD(DAY,-15,CAST(GETDATE() AS DATE)),3000000,12,'FINISHED',1);

DECLARE @DemoTournament BIGINT=(SELECT id FROM dbo.tournament WHERE name=N'Demo Tournament 2026'), @ShowcaseTournament BIGINT=(SELECT id FROM dbo.tournament WHERE name=N'Results Showcase 2026');
IF NOT EXISTS(SELECT 1 FROM dbo.race WHERE tournament_id=@DemoTournament AND name=N'Round 1 - 1200m') INSERT dbo.race(tournament_id,referee_id,name,round_number,race_date,distance_m,max_participants,status,gates_configured,published) VALUES(@DemoTournament,@Ref,N'Round 1 - 1200m',1,DATEADD(DAY,1,GETDATE()),1200,12,'SCHEDULED',1,1);
IF NOT EXISTS(SELECT 1 FROM dbo.race WHERE tournament_id=@ShowcaseTournament AND name=N'Showcase Final - 1600m') INSERT dbo.race(tournament_id,referee_id,name,round_number,race_date,distance_m,max_participants,status,gates_configured,published) VALUES(@ShowcaseTournament,@Ref,N'Showcase Final - 1600m',1,DATEADD(DAY,-10,GETDATE()),1600,12,'COMPLETED',1,1);

DECLARE @DemoRace BIGINT=(SELECT id FROM dbo.race WHERE tournament_id=@DemoTournament AND name=N'Round 1 - 1200m'), @ShowcaseRace BIGINT=(SELECT id FROM dbo.race WHERE tournament_id=@ShowcaseTournament AND name=N'Showcase Final - 1600m'), @Thunder BIGINT=(SELECT id FROM dbo.horse WHERE owner_id=@Owner AND name=N'Thunder'), @Lightning BIGINT=(SELECT id FROM dbo.horse WHERE owner_id=@Owner AND name=N'Lightning'), @IronDuke BIGINT=(SELECT id FROM dbo.horse WHERE owner_id=@Owner AND name=N'Iron Duke'), @DemoStar BIGINT=(SELECT id FROM dbo.horse WHERE owner_id=@Owner AND name=N'Demo Star'), @SilverComet BIGINT=(SELECT id FROM dbo.horse WHERE owner_id=@Owner AND name=N'Silver Comet');
IF NOT EXISTS(SELECT 1 FROM dbo.race_entry WHERE horse_id=@Thunder AND tournament_id=@DemoTournament) INSERT dbo.race_entry(horse_id,jockey_id,tournament_id,race_id,status,approved_at,gate_number) VALUES(@Thunder,@Jockey,@DemoTournament,@DemoRace,'APPROVED',SYSUTCDATETIME(),1);
IF NOT EXISTS(SELECT 1 FROM dbo.race_entry WHERE horse_id=@Lightning AND tournament_id=@DemoTournament) INSERT dbo.race_entry(horse_id,jockey_id,tournament_id,race_id,status,approved_at,gate_number) VALUES(@Lightning,@Jockey2,@DemoTournament,@DemoRace,'APPROVED',SYSUTCDATETIME(),2);
IF NOT EXISTS(SELECT 1 FROM dbo.race_entry WHERE horse_id=@IronDuke AND tournament_id=@DemoTournament) INSERT dbo.race_entry(horse_id,tournament_id,status) VALUES(@IronDuke,@DemoTournament,'PENDING');
IF NOT EXISTS(SELECT 1 FROM dbo.race_entry WHERE horse_id=@DemoStar AND tournament_id=@ShowcaseTournament) INSERT dbo.race_entry(horse_id,jockey_id,tournament_id,race_id,status,approved_at,gate_number,checked_in,checked_in_at) VALUES(@DemoStar,@Jockey,@ShowcaseTournament,@ShowcaseRace,'APPROVED',SYSUTCDATETIME(),1,1,DATEADD(DAY,-10,GETDATE()));
IF NOT EXISTS(SELECT 1 FROM dbo.race_entry WHERE horse_id=@SilverComet AND tournament_id=@ShowcaseTournament) INSERT dbo.race_entry(horse_id,jockey_id,tournament_id,race_id,status,approved_at,gate_number,checked_in,checked_in_at) VALUES(@SilverComet,@Jockey3,@ShowcaseTournament,@ShowcaseRace,'APPROVED',SYSUTCDATETIME(),2,1,DATEADD(DAY,-10,GETDATE()));

DECLARE @DemoStarEntry BIGINT=(SELECT id FROM dbo.race_entry WHERE horse_id=@DemoStar AND tournament_id=@ShowcaseTournament), @SilverCometEntry BIGINT=(SELECT id FROM dbo.race_entry WHERE horse_id=@SilverComet AND tournament_id=@ShowcaseTournament);
IF NOT EXISTS(SELECT 1 FROM dbo.race_result WHERE entry_id=@DemoStarEntry) INSERT dbo.race_result(race_id,entry_id,finish_rank,finish_time_ms) VALUES(@ShowcaseRace,@DemoStarEntry,1,101250);
IF NOT EXISTS(SELECT 1 FROM dbo.race_result WHERE entry_id=@SilverCometEntry) INSERT dbo.race_result(race_id,entry_id,finish_rank,finish_time_ms,violation_notes) VALUES(@ShowcaseRace,@SilverCometEntry,2,103890,'Minor track interference reviewed by referee.');
IF NOT EXISTS(SELECT 1 FROM dbo.referee_report WHERE race_id=@ShowcaseRace) INSERT dbo.referee_report(race_id,referee_id,violations,notes,confirmed,confirmed_at,submitted,submitted_at) VALUES(@ShowcaseRace,@Ref,'Minor track interference reviewed; no disqualification.','Demo report confirmed by admin and published with results.',1,DATEADD(DAY,-10,SYSUTCDATETIME()),1,DATEADD(DAY,-10,SYSUTCDATETIME()));
IF NOT EXISTS(SELECT 1 FROM dbo.notification WHERE user_id=@Owner AND type='RACE_RESULT' AND ref_id=@ShowcaseRace) INSERT dbo.notification(user_id,title,message,type,ref_id,ref_type) VALUES(@Owner,N'Race results published','Results Showcase 2026 final results are now available.','RACE_RESULT',@ShowcaseRace,'RACE');

COMMIT TRANSACTION;
PRINT 'HorseRacingManagement schema and demo data are ready.';
GO
