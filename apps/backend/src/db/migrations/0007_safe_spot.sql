-- Enum already exists from previous migration attempts
-- Just need to convert the column

-- Set NULL values to 'user' before making NOT NULL
UPDATE "user" SET role = 'user' WHERE role IS NULL;--> statement-breakpoint

-- Alter the column with proper USING clause for casting text to enum
ALTER TABLE "user" ALTER COLUMN "role" TYPE user_role USING role::user_role;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;