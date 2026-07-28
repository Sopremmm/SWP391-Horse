-- Drop the existing unique constraint
ALTER TABLE jockey_invitation DROP CONSTRAINT UK_jockey_invitation_race;

-- Add tournament_id column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[jockey_invitation]') AND name = 'tournament_id')
BEGIN
    ALTER TABLE jockey_invitation ADD tournament_id bigint NULL;
END
GO

-- Add the new unique constraint for tournament_id instead of race_id
ALTER TABLE jockey_invitation ADD CONSTRAINT UK_jockey_invitation_tournament UNIQUE (horse_id, jockey_id, tournament_id);
GO
