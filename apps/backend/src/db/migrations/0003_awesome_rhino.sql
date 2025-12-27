ALTER TABLE "orders" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "zip" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "country" text DEFAULT 'US';