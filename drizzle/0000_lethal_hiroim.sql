CREATE TABLE `deps` (
	`source` text NOT NULL,
	`dest` text NOT NULL,
	PRIMARY KEY(`source`, `dest`),
	FOREIGN KEY (`source`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dest`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`numDeps` integer NOT NULL,
	`isComplete` integer NOT NULL
);
