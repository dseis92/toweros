DO $$ BEGIN
 CREATE TYPE "public"."company_type" AS ENUM('CONTRACTOR', 'CARRIER', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."crew_status" AS ENUM('AVAILABLE', 'ASSIGNED', 'OFFLINE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_tier" AS ENUM('BASIC', 'PRO', 'ENTERPRISE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'COMPANY_ADMIN', 'PROJECT_MANAGER', 'FOREMAN', 'TECHNICIAN', 'INSPECTOR', 'CLIENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."band" AS ENUM('B2_1900', 'B4_AWS', 'B5_850', 'B12_700', 'B13_700', 'B14_700', 'B25_1900', 'B26_850', 'B66_AWS', 'B71_600', 'N2_1900', 'N41_2500', 'N77_3700', 'N78_3500', 'N261_28GHZ');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."carrier" AS ENUM('ATT', 'VERIZON', 'TMOBILE', 'DISH', 'US_CELLULAR', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sector_status" AS ENUM('PLANNED', 'INSTALLED', 'TESTED', 'ON_AIR', 'DECOMMISSIONED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."site_status" AS ENUM('PLANNED', 'PERMITTING', 'CONSTRUCTION', 'TESTING', 'INSPECTION', 'PUNCH_LIST', 'ACCEPTED', 'ON_AIR', 'MAINTENANCE', 'DECOMMISSIONED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."site_type" AS ENUM('MONOPOLE', 'LATTICE_TOWER', 'GUYED_TOWER', 'ROOFTOP', 'WATER_TANK', 'SMALL_CELL', 'DAS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."connection_status" AS ENUM('PLANNED', 'INSTALLED', 'TESTED', 'ACTIVE', 'DISCONNECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."connection_type" AS ENUM('RF_PATH', 'FIBER', 'POWER', 'RET_CONTROL', 'ETHERNET', 'AISG', 'ALARM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equipment_category" AS ENUM('RF', 'POWER', 'STRUCTURAL', 'CONNECTIVITY', 'SAFETY', 'BACKHAUL', 'MONITORING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equipment_status" AS ENUM('ORDERED', 'RECEIVED', 'STAGED', 'INSTALLED', 'TESTED', 'IN_SERVICE', 'FAILED', 'REMOVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equipment_type" AS ENUM('ANTENNA', 'RADIO_RRU', 'RADIO_BBU', 'RET', 'HYBRID_CABLE', 'FIBER_CABLE', 'COAX_CABLE', 'POWER_CABLE', 'RECTIFIER', 'BATTERY', 'BREAKER', 'GROUNDING_KIT', 'MOUNT', 'BRACKET', 'CABINET', 'MICROWAVE_DISH', 'GPS_ANTENNA', 'JUMPER', 'SURGE_PROTECTOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."project_status" AS ENUM('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."task_status" AS ENUM('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'SKIPPED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."task_type" AS ENUM('SAFETY_BRIEFING', 'SITE_SURVEY', 'MATERIAL_STAGING', 'EQUIPMENT_INSTALLATION', 'CABLE_ROUTING', 'FIBER_TERMINATION', 'POWER_INSTALLATION', 'GROUNDING', 'TESTING_PIM', 'TESTING_VSWR', 'TESTING_FIBER', 'TESTING_POWER', 'INSPECTION', 'DOCUMENTATION', 'PUNCH_LIST_ITEM', 'CLEANUP');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."work_order_status" AS ENUM('DRAFT', 'SCHEDULED', 'ASSIGNED', 'MOBILIZED', 'IN_PROGRESS', 'ON_HOLD', 'TESTING', 'INSPECTION', 'PUNCH_LIST', 'COMPLETED', 'ACCEPTED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."work_type" AS ENUM('NEW_BUILD', 'MODERNIZATION', 'DECOMMISSION', 'MAINTENANCE', 'REPAIR', 'INSPECTION', 'TESTING', 'EMERGENCY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."document_type" AS ENUM('CONSTRUCTION_DRAWING', 'RF_DESIGN', 'STRUCTURAL_DRAWING', 'SITE_PLAN', 'TEST_REPORT', 'INSPECTION_REPORT', 'CLOSEOUT_PACKAGE', 'MANUAL', 'SPEC_SHEET', 'PERMIT', 'LEASE_AGREEMENT', 'INSURANCE_CERTIFICATE', 'SAFETY_PLAN', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."photo_category" AS ENUM('SITE_OVERVIEW', 'EQUIPMENT_INSTALLED', 'EQUIPMENT_CLOSEUP', 'BEFORE', 'AFTER', 'INSPECTION_FINDING', 'SAFETY_ISSUE', 'TEST_RESULT', 'LABEL', 'DOCUMENTATION', 'DAMAGE', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "company_type" NOT NULL,
	"logo_url" text,
	"settings" jsonb DEFAULT '{"timezone":"America/New_York","dateFormat":"MM/DD/YYYY","units":"IMPERIAL","defaultCurrency":"USD"}'::jsonb NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'BASIC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crews" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"crew_lead_id" text NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specialization" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "crew_status" DEFAULT 'AVAILABLE' NOT NULL,
	"current_site_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"device_name" text NOT NULL,
	"platform" text NOT NULL,
	"app_version" text NOT NULL,
	"last_sync_at" timestamp with time zone,
	"push_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"device_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"manager_id" text NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" "user_role" DEFAULT 'TECHNICIAN' NOT NULL,
	"avatar_url" text,
	"password_hash" text,
	"certifications" jsonb DEFAULT '[]'::jsonb,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"last_active_at" timestamp with time zone,
	"email_verified" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sectors" (
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"sector_number" real NOT NULL,
	"azimuth" real NOT NULL,
	"beamwidth" real NOT NULL,
	"mechanical_tilt" real DEFAULT 0,
	"electrical_tilt" real DEFAULT 0,
	"mount_height_ft" real NOT NULL,
	"mount_type" text,
	"bands" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "sector_status" DEFAULT 'PLANNED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sites" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"site_code" text,
	"fa_number" text,
	"carrier" "carrier" NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"address" jsonb NOT NULL,
	"elevation_ft" real,
	"site_type" "site_type" NOT NULL,
	"tower_height_ft" real,
	"structure_owner" text,
	"status" "site_status" DEFAULT 'PLANNED' NOT NULL,
	"construction_start" date,
	"on_air_date" date,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipment" (
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"sector_id" text,
	"company_id" text NOT NULL,
	"equipment_type" "equipment_type" NOT NULL,
	"category" "equipment_category" NOT NULL,
	"manufacturer" text NOT NULL,
	"model" text NOT NULL,
	"serial_number" text,
	"firmware_version" text,
	"mount_location" text,
	"mount_height_ft" real,
	"gps_latitude" real,
	"gps_longitude" real,
	"installation_date" date,
	"installed_by" text,
	"crew_id" text,
	"work_order_id" text,
	"status" "equipment_status" DEFAULT 'ORDERED' NOT NULL,
	"in_service_date" date,
	"removal_date" date,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"warranty_start" date,
	"warranty_months" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipment_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"from_equipment_id" text NOT NULL,
	"to_equipment_id" text NOT NULL,
	"connection_type" "connection_type" NOT NULL,
	"from_port" text,
	"to_port" text,
	"cable_length_ft" real,
	"cable_type" text,
	"connector_types" jsonb DEFAULT '[]'::jsonb,
	"tested_at" timestamp with time zone,
	"test_results" jsonb,
	"status" "connection_status" DEFAULT 'PLANNED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_results" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"equipment_id" text NOT NULL,
	"site_id" text NOT NULL,
	"work_order_id" text,
	"task_id" text,
	"test_type" text NOT NULL,
	"result" text NOT NULL,
	"passed" integer NOT NULL,
	"measurements" jsonb DEFAULT '{}'::jsonb,
	"tested_by" text NOT NULL,
	"tested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"client" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"budget" real,
	"status" "project_status" DEFAULT 'PLANNING' NOT NULL,
	"project_manager_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"work_order_id" text NOT NULL,
	"company_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"task_type" "task_type" NOT NULL,
	"sequence_number" integer NOT NULL,
	"assigned_to" text NOT NULL,
	"assigned_by" text NOT NULL,
	"equipment_id" text,
	"status" "task_status" DEFAULT 'PENDING' NOT NULL,
	"blocked_reason" text,
	"estimated_minutes" integer,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"actual_minutes" integer,
	"checklist_items" jsonb DEFAULT '[]'::jsonb,
	"result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"completed_by" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"project_id" text,
	"site_id" text NOT NULL,
	"work_order_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"work_type" "work_type" NOT NULL,
	"scheduled_start" timestamp with time zone NOT NULL,
	"scheduled_end" timestamp with time zone NOT NULL,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"assigned_to_crew_id" text,
	"assigned_to_user_id" text,
	"assigned_by" text NOT NULL,
	"status" "work_order_status" DEFAULT 'DRAFT' NOT NULL,
	"priority" "priority" DEFAULT 'NORMAL' NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"tasks_completed" integer DEFAULT 0 NOT NULL,
	"tasks_total" integer DEFAULT 0 NOT NULL,
	"estimated_cost" real,
	"actual_cost" real,
	"labor_hours_estimated" real,
	"labor_hours_actual" real,
	"carrier_po" text,
	"carrier_contact" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	CONSTRAINT "work_orders_work_order_number_unique" UNIQUE("work_order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"site_id" text,
	"work_order_id" text,
	"project_id" text,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"file_size_bytes" bigint NOT NULL,
	"mime_type" text NOT NULL,
	"document_type" "document_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"version" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"extracted_text" text,
	"page_count" integer,
	"uploaded_by" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "photos" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"site_id" text,
	"equipment_id" text,
	"work_order_id" text,
	"task_id" text,
	"filename" text NOT NULL,
	"original_url" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"file_size_bytes" bigint NOT NULL,
	"mime_type" text NOT NULL,
	"dimensions" jsonb NOT NULL,
	"caption" text,
	"category" "photo_category" NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"taken_at" timestamp with time zone NOT NULL,
	"gps_latitude" real,
	"gps_longitude" real,
	"device_model" text,
	"camera_settings" jsonb,
	"uploaded_by" text NOT NULL,
	"uploaded_from_device" text NOT NULL,
	"is_processed" boolean DEFAULT false NOT NULL,
	"is_analyzed" boolean DEFAULT false NOT NULL,
	"ai_tags" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"aggregate_type" text NOT NULL,
	"aggregate_id" text NOT NULL,
	"timestamp" bigint NOT NULL,
	"server_timestamp" bigint NOT NULL,
	"vector_clock" jsonb NOT NULL,
	"causation_id" text,
	"correlation_id" text,
	"company_id" text NOT NULL,
	"user_id" text NOT NULL,
	"device_id" text NOT NULL,
	"session_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"metadata" jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sync_queue" (
	"id" text PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"event_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"error" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"synced_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_lockouts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"failed_attempts" integer NOT NULL,
	"locked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"released" boolean DEFAULT false NOT NULL,
	"released_at" timestamp with time zone,
	"released_by" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"ip_address" text NOT NULL,
	"user_agent" text NOT NULL,
	"success" boolean NOT NULL,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp with time zone,
	"ip_address" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"device_id" text NOT NULL,
	"user_agent" text NOT NULL,
	"ip_address" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_reason" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crews" ADD CONSTRAINT "crews_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crews" ADD CONSTRAINT "crews_crew_lead_id_users_id_fk" FOREIGN KEY ("crew_lead_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sectors" ADD CONSTRAINT "sectors_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sectors" ADD CONSTRAINT "sectors_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sites" ADD CONSTRAINT "sites_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sites" ADD CONSTRAINT "sites_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sites" ADD CONSTRAINT "sites_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_installed_by_users_id_fk" FOREIGN KEY ("installed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment" ADD CONSTRAINT "equipment_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment_connections" ADD CONSTRAINT "equipment_connections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment_connections" ADD CONSTRAINT "equipment_connections_from_equipment_id_equipment_id_fk" FOREIGN KEY ("from_equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipment_connections" ADD CONSTRAINT "equipment_connections_to_equipment_id_equipment_id_fk" FOREIGN KEY ("to_equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_results" ADD CONSTRAINT "test_results_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_results" ADD CONSTRAINT "test_results_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_results" ADD CONSTRAINT "test_results_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_results" ADD CONSTRAINT "test_results_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_results" ADD CONSTRAINT "test_results_tested_by_users_id_fk" FOREIGN KEY ("tested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_project_manager_id_users_id_fk" FOREIGN KEY ("project_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_to_crew_id_crews_id_fk" FOREIGN KEY ("assigned_to_crew_id") REFERENCES "public"."crews"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_uploaded_from_device_devices_id_fk" FOREIGN KEY ("uploaded_from_device") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sync_queue" ADD CONSTRAINT "sync_queue_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sync_queue" ADD CONSTRAINT "sync_queue_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_lockouts" ADD CONSTRAINT "account_lockouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account_lockouts" ADD CONSTRAINT "account_lockouts_released_by_users_id_fk" FOREIGN KEY ("released_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companies_name_idx" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crews_company_idx" ON "crews" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crews_crew_lead_idx" ON "crews" USING btree ("crew_lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crews_status_idx" ON "crews" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "devices_user_idx" ON "devices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "devices_platform_idx" ON "devices" USING btree ("platform");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_device_idx" ON "sessions" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_expires_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_company_idx" ON "teams" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_manager_idx" ON "teams" USING btree ("manager_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_company_idx" ON "users" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sectors_site_idx" ON "sectors" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sectors_company_idx" ON "sectors" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sectors_status_idx" ON "sectors" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_company_idx" ON "sites" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_status_idx" ON "sites" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_carrier_idx" ON "sites" USING btree ("carrier");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_location_idx" ON "sites" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sites_created_by_idx" ON "sites" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_site_idx" ON "equipment" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_sector_idx" ON "equipment" USING btree ("sector_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_company_idx" ON "equipment" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_type_idx" ON "equipment" USING btree ("equipment_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_category_idx" ON "equipment" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_status_idx" ON "equipment" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_serial_number_idx" ON "equipment" USING btree ("serial_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_site_type_status_idx" ON "equipment" USING btree ("site_id","equipment_type","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_connections_from_idx" ON "equipment_connections" USING btree ("from_equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_connections_to_idx" ON "equipment_connections" USING btree ("to_equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_connections_company_idx" ON "equipment_connections" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_connections_type_idx" ON "equipment_connections" USING btree ("connection_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "equipment_connections_status_idx" ON "equipment_connections" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_equipment_idx" ON "test_results" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_site_idx" ON "test_results" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_company_idx" ON "test_results" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_type_idx" ON "test_results" USING btree ("test_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_result_idx" ON "test_results" USING btree ("result");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_results_tested_by_idx" ON "test_results" USING btree ("tested_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_company_idx" ON "projects" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_pm_idx" ON "projects" USING btree ("project_manager_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_work_order_idx" ON "tasks" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_company_idx" ON "tasks" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_assigned_to_idx" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_equipment_idx" ON "tasks" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_company_idx" ON "work_orders" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_project_idx" ON "work_orders" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_site_idx" ON "work_orders" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_status_idx" ON "work_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_crew_idx" ON "work_orders" USING btree ("assigned_to_crew_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_user_idx" ON "work_orders" USING btree ("assigned_to_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_company_status_idx" ON "work_orders" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_company_idx" ON "documents" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_site_idx" ON "documents" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_work_order_idx" ON "documents" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_project_idx" ON "documents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_type_idx" ON "documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_uploaded_by_idx" ON "documents" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_company_idx" ON "photos" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_site_idx" ON "photos" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_equipment_idx" ON "photos" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_work_order_idx" ON "photos" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_task_idx" ON "photos" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_category_idx" ON "photos" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_taken_at_idx" ON "photos" USING btree ("taken_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_uploaded_by_idx" ON "photos" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_site_context_idx" ON "photos" USING btree ("site_id","category","taken_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_aggregate_idx" ON "events" USING btree ("aggregate_type","aggregate_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_type_idx" ON "events" USING btree ("type","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_user_idx" ON "events" USING btree ("user_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_company_idx" ON "events" USING btree ("company_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_correlation_idx" ON "events" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_causation_idx" ON "events" USING btree ("causation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_timestamp_idx" ON "events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_server_timestamp_idx" ON "events" USING btree ("server_timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sync_queue_device_idx" ON "sync_queue" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sync_queue_status_idx" ON "sync_queue" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sync_queue_pending_idx" ON "sync_queue" USING btree ("device_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_lockouts_user_id_idx" ON "account_lockouts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_lockouts_expires_at_idx" ON "account_lockouts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_email_idx" ON "login_attempts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_ip_address_idx" ON "login_attempts" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_created_at_idx" ON "login_attempts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_email_created_at_idx" ON "login_attempts" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_tokens_expires_at_idx" ON "password_reset_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_tokens_device_id_idx" ON "refresh_tokens" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_tokens_expires_at_idx" ON "refresh_tokens" USING btree ("expires_at");