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
        jdbcTemplate.execute("IF COL_LENGTH('dbo.[user]', 'balance') IS NULL ALTER TABLE dbo.[user] ADD balance DECIMAL(15,2) NULL");
        jdbcTemplate.execute("UPDATE dbo.[user] SET balance = 0.00 WHERE balance IS NULL");
        jdbcTemplate.execute("""
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'dbo.[user]')
                      AND name = 'balance'
                      AND is_nullable = 1
                )
                ALTER TABLE dbo.[user] ALTER COLUMN balance DECIMAL(15,2) NOT NULL
                """);
        jdbcTemplate.execute("""
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.default_constraints dc
                    INNER JOIN sys.columns c
                        ON c.default_object_id = dc.object_id
                    WHERE dc.parent_object_id = OBJECT_ID(N'dbo.[user]')
                      AND c.name = 'balance'
                )
                ALTER TABLE dbo.[user] ADD CONSTRAINT DF_user_balance DEFAULT (0.00) FOR balance
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.topup_request', N'U') IS NULL
                CREATE TABLE dbo.topup_request (
                    id BIGINT IDENTITY(1,1) PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    amount DECIMAL(15,2) NOT NULL,
                    status VARCHAR(20) NOT NULL CONSTRAINT DF_topup_request_status DEFAULT 'PENDING',
                    reference VARCHAR(64) NOT NULL,
                    bank_txn_id VARCHAR(64) NULL,
                    created_at DATETIME2 NOT NULL CONSTRAINT DF_topup_request_created_at DEFAULT GETDATE(),
                    paid_at DATETIME2 NULL,
                    CONSTRAINT FK_topup_request_user FOREIGN KEY (user_id) REFERENCES dbo.[user](id),
                    CONSTRAINT UQ_topup_request_reference UNIQUE (reference),
                    CONSTRAINT UQ_topup_request_bank_txn_id UNIQUE (bank_txn_id),
                    CONSTRAINT CK_topup_request_status CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED'))
                )
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
                IF OBJECT_ID(N'dbo.bet', N'U') IS NULL
                CREATE TABLE dbo.bet (
                    id BIGINT IDENTITY(1,1) PRIMARY KEY,
                    spectator_id BIGINT NOT NULL,
                    race_id BIGINT NOT NULL,
                    predicted_entry_id BIGINT NOT NULL,
                    result VARCHAR(10) NOT NULL CONSTRAINT DF_bet_result DEFAULT 'PENDING',
                    placed_at DATETIME2 NOT NULL CONSTRAINT DF_bet_placed_at DEFAULT GETDATE(),
                    resolved_at DATETIME2 NULL,
                    CONSTRAINT FK_bet_spectator FOREIGN KEY (spectator_id) REFERENCES dbo.[user](id),
                    CONSTRAINT FK_bet_race FOREIGN KEY (race_id) REFERENCES dbo.race(id) ON DELETE CASCADE,
                    CONSTRAINT FK_bet_predicted_entry FOREIGN KEY (predicted_entry_id) REFERENCES dbo.race_entry(id) ON DELETE CASCADE,
                    CONSTRAINT UQ_bet_spectator_race UNIQUE (spectator_id, race_id),
                    CONSTRAINT CK_bet_result CHECK (result IN ('PENDING', 'WIN', 'LOSE'))
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
                                'BET_WIN',
                                'BET_LOSE',
                                'SYSTEM',
                                'TOPUP_SUCCESS',
                                'TOPUP_APPROVED'
                            )
                        );
                    END
                END
                """);
    }
}
