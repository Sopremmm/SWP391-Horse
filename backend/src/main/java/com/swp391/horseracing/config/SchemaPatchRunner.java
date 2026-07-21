package com.swp391.horseracing.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaPatchRunner implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    public SchemaPatchRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.race', N'U') IS NOT NULL
                BEGIN
                    DECLARE @dropRoundUnique NVARCHAR(MAX) = N'';
                    SELECT @dropRoundUnique = STRING_AGG(
                        N'ALTER TABLE dbo.race DROP CONSTRAINT [' + kc.name + N']', N'; ')
                    FROM sys.key_constraints kc
                    WHERE kc.parent_object_id = OBJECT_ID(N'dbo.race')
                      AND kc.[type] = N'UQ'
                      AND EXISTS (
                          SELECT 1
                          FROM sys.index_columns ic
                          JOIN sys.columns c
                            ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                          WHERE ic.object_id = kc.parent_object_id
                            AND ic.index_id = kc.unique_index_id
                            AND c.name = N'tournament_id'
                      )
                      AND EXISTS (
                          SELECT 1
                          FROM sys.index_columns ic
                          JOIN sys.columns c
                            ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                          WHERE ic.object_id = kc.parent_object_id
                            AND ic.index_id = kc.unique_index_id
                            AND c.name = N'round_number'
                      );

                    IF @dropRoundUnique IS NOT NULL AND LEN(@dropRoundUnique) > 0
                        EXEC sp_executesql @dropRoundUnique;
                END
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.audit_log', N'U') IS NULL
                CREATE TABLE dbo.audit_log (
                    id BIGINT IDENTITY(1,1) PRIMARY KEY,
                    actor_user_id BIGINT NOT NULL,
                    action VARCHAR(50) NOT NULL,
                    ref_type VARCHAR(50) NULL,
                    ref_id BIGINT NULL,
                    details NVARCHAR(MAX) NULL,
                    created_at DATETIME2 NOT NULL CONSTRAINT DF_audit_log_created_at DEFAULT GETDATE(),
                    CONSTRAINT FK_audit_log_actor FOREIGN KEY (actor_user_id) REFERENCES dbo.[user](id)
                )
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.prize', N'U') IS NULL
                CREATE TABLE dbo.prize (
                    id BIGINT IDENTITY(1,1) PRIMARY KEY,
                    race_id BIGINT NOT NULL,
                    entry_id BIGINT NOT NULL,
                    finish_rank INT NOT NULL,
                    amount DECIMAL(15,2) NOT NULL,
                    paid_at DATETIME2 NULL,
                    created_at DATETIME2 NOT NULL CONSTRAINT DF_prize_created_at DEFAULT GETDATE(),
                    CONSTRAINT FK_prize_race FOREIGN KEY (race_id) REFERENCES dbo.race(id) ON DELETE CASCADE,
                    CONSTRAINT FK_prize_entry FOREIGN KEY (entry_id) REFERENCES dbo.race_entry(id) ON DELETE CASCADE,
                    CONSTRAINT UQ_prize_race_entry UNIQUE (race_id, entry_id)
                )
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.notification', N'U') IS NOT NULL
                BEGIN
                    DECLARE @dropNotificationChecks NVARCHAR(MAX) = N'';
                    SELECT @dropNotificationChecks =
                        STRING_AGG(N'ALTER TABLE dbo.notification DROP CONSTRAINT [' + cc.name + N']', N'; ')
                    FROM sys.check_constraints cc
                    WHERE cc.parent_object_id = OBJECT_ID(N'dbo.notification')
                      AND (cc.definition LIKE N'%type%' OR cc.name = N'ck_notification_type');

                    IF @dropNotificationChecks IS NOT NULL AND LEN(@dropNotificationChecks) > 0
                        EXEC sp_executesql @dropNotificationChecks;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM sys.check_constraints
                        WHERE parent_object_id = OBJECT_ID(N'dbo.notification')
                          AND name = N'ck_notification_type'
                    )
                    BEGIN
                        ALTER TABLE dbo.notification
                        ADD CONSTRAINT ck_notification_type CHECK (
                            type IN (
                                'JOCKEY_INVITE',
                                'REG_APPROVED',
                                'REG_REJECTED',
                                'RACE_RESULT',
                                'SYSTEM'
                            )
                        );
                    END
                END
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.race_entry', N'U') IS NOT NULL
                   AND COL_LENGTH(N'dbo.race_entry', N'gate_number') IS NULL
                BEGIN
                    ALTER TABLE dbo.race_entry ADD gate_number INT NULL;
                END
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.tournament', N'U') IS NOT NULL
                   AND COL_LENGTH(N'dbo.tournament', N'image_url') IS NULL
                BEGIN
                    ALTER TABLE dbo.tournament ADD image_url NVARCHAR(MAX) NULL;
                END
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.horse', N'U') IS NOT NULL
                BEGIN
                    IF COL_LENGTH(N'dbo.horse', N'condition') IS NULL
                        ALTER TABLE dbo.horse ADD condition VARCHAR(20) NULL;

                    UPDATE dbo.horse SET condition = 'PEAK'
                    WHERE condition IS NULL OR LTRIM(RTRIM(condition)) = '';

                    ALTER TABLE dbo.horse ALTER COLUMN condition VARCHAR(20) NOT NULL;
                    ALTER TABLE dbo.horse ALTER COLUMN image_url NVARCHAR(MAX) NULL;
                END
                """);
    }
}
