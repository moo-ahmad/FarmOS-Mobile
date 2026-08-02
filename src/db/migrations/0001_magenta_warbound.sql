CREATE TABLE `activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`farm_id` text NOT NULL,
	`activity_type` text NOT NULL,
	`quantity` text NOT NULL,
	`unit` text NOT NULL,
	`cost` text,
	`notes` text,
	`occurred_at` text NOT NULL,
	`client_created_at_utc` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`synced_at` text
);
--> statement-breakpoint
CREATE INDEX `activity_logs_farm_occurred_idx` ON `activity_logs` (`farm_id`,`occurred_at`);