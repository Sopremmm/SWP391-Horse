package com.swp391.horseracing.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class JockeyAvatarSchemaMigration implements ApplicationRunner {
    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    public JockeyAvatarSchemaMigration(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            String databaseProduct = connection.getMetaData().getDatabaseProductName();
            if (!databaseProduct.toLowerCase().contains("microsoft sql server")) {
                return;
            }
        }

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.[user]', N'U') IS NOT NULL
                   AND EXISTS (
                       SELECT 1
                       FROM sys.columns
                       WHERE object_id = OBJECT_ID(N'dbo.[user]')
                         AND name = N'avatar_url'
                         AND max_length <> -1
                   )
                BEGIN
                    ALTER TABLE dbo.[user] ALTER COLUMN avatar_url NVARCHAR(MAX) NULL;
                END
                """);

        jdbcTemplate.execute("""
                IF OBJECT_ID(N'dbo.jockey_profile', N'U') IS NOT NULL
                BEGIN
                    IF COL_LENGTH(N'dbo.jockey_profile', N'age') IS NULL
                        ALTER TABLE dbo.jockey_profile ADD age INT NULL;

                    IF COL_LENGTH(N'dbo.jockey_profile', N'gender') IS NULL
                        ALTER TABLE dbo.jockey_profile ADD gender VARCHAR(20) NULL;

                    IF COL_LENGTH(N'dbo.jockey_profile', N'invitation_rate') IS NULL
                        ALTER TABLE dbo.jockey_profile ADD invitation_rate DECIMAL(15,2) NULL;

                    IF COL_LENGTH(N'dbo.jockey_profile', N'international_travel') IS NULL
                        ALTER TABLE dbo.jockey_profile ADD international_travel BIT NOT NULL
                            CONSTRAINT DF_jockey_profile_international_travel DEFAULT 0;
                END
                """);
    }
}