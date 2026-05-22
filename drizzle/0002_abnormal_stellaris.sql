ALTER TABLE `quotes` ADD `extrasJson` text DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` DROP COLUMN `extras`;