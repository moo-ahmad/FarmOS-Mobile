CREATE TABLE `activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`farm_id` text NOT NULL,
	`operation` text NOT NULL,
	`field_code` text NOT NULL,
	`crop_label` text NOT NULL,
	`product` text,
	`dose_value` text,
	`dose_unit` text,
	`water_value` text,
	`water_unit` text,
	`conditions_temp_c` integer,
	`conditions_wind_kph` integer,
	`conditions_ppe` integer,
	`safe_harvest_date` text,
	`phi_days` integer,
	`occurred_at` text NOT NULL,
	`client_created_at_utc` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`synced_at` text
);
-- statement-breakpoint
CREATE INDEX `activity_logs_farm_occurred_idx` ON `activity_logs` (`farm_id`,`occurred_at`);