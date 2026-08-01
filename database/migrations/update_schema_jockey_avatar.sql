IF OBJECT_ID(N'dbo.[user]', N'U') IS NOT NULL
   AND COL_LENGTH(N'dbo.[user]', N'avatar_url') IS NOT NULL
BEGIN
    ALTER TABLE dbo.[user] ALTER COLUMN avatar_url NVARCHAR(MAX) NULL;
END;

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
END;