CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`clientName` varchar(256) NOT NULL,
	`rawInput` text,
	`bedrooms` int NOT NULL DEFAULT 0,
	`bathrooms` int NOT NULL DEFAULT 0,
	`serviceType` varchar(128) NOT NULL DEFAULT 'Standard Cleaning',
	`extras` json NOT NULL DEFAULT ('[]'),
	`notes` text,
	`estimateMin` decimal(10,2),
	`estimateMax` decimal(10,2),
	`ctaLabel` enum('Book This Cleaning','Confirm My Date & Time') NOT NULL DEFAULT 'Book This Cleaning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotes_slug_unique` UNIQUE(`slug`)
);
