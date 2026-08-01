CREATE TABLE `outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`op_type` text NOT NULL,
	`payload` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`batch_id` text,
	`client_created_at_utc` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `outbox_status_client_created_idx` ON `outbox` (`status`,`client_created_at_utc`);--> statement-breakpoint
CREATE INDEX `outbox_entity_idx` ON `outbox` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `sync_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
