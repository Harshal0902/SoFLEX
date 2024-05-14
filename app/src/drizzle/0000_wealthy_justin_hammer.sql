-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "auth"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "auth"."code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "auth"."factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "auth"."factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "auth"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pgsodium"."key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pgsodium"."key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "realtime"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "realtime"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset_details" (
	"asset_name" text PRIMARY KEY NOT NULL,
	"asset_symbol" text NOT NULL,
	"asset_logo" text NOT NULL,
	"asset_price" text NOT NULL,
	"asset_total_supply" text NOT NULL,
	"asset_yield" text NOT NULL,
	"asset_total_borrow" text NOT NULL,
	"asset_ltv" text NOT NULL,
	CONSTRAINT "asset_details_asset_name_key" UNIQUE("asset_name"),
	CONSTRAINT "asset_details_asset_symbol_key" UNIQUE("asset_symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "defi_lending" (
	"user_address" text NOT NULL,
	"lending_amount" text NOT NULL,
	"lending_submitted_at" timestamp with time zone NOT NULL,
	"lending_id" text PRIMARY KEY NOT NULL,
	"lending_token" text NOT NULL,
	"transaction_signature" text NOT NULL,
	CONSTRAINT "defi_lending_lending_id_key" UNIQUE("lending_id"),
	CONSTRAINT "defi_lending_transaction_signature_key" UNIQUE("transaction_signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nft_collection_details" (
	"nft_name" text PRIMARY KEY NOT NULL,
	"nft_logo" text NOT NULL,
	"nft_pool" text NOT NULL,
	"nft_best_offer" text NOT NULL,
	"nft_intrest" text NOT NULL,
	"nft_duration" text NOT NULL,
	"nft_apy" text NOT NULL,
	"nft_floor_price" text NOT NULL,
	CONSTRAINT "nft_collection_details_nft_name_key" UNIQUE("nft_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "defi_borrowing" (
	"borrow_id" text PRIMARY KEY NOT NULL,
	"user_address" text NOT NULL,
	"borrowing_amount" text NOT NULL,
	"borrowing_submitted_at" timestamp with time zone NOT NULL,
	"borrowing_token" text NOT NULL,
	"borrowing_collateralization_assets" text NOT NULL,
	"borrowing_duration" text NOT NULL,
	"borrowing_interest_rate" text NOT NULL,
	"borrowing_status" text NOT NULL,
	"borrowing_due_by" timestamp with time zone NOT NULL,
	"borrowing_total" text NOT NULL,
	"transaction_signature" text,
	"borrowing_repayed_on" timestamp with time zone,
	CONSTRAINT "defi_borrowing_borrow_id_key" UNIQUE("borrow_id"),
	CONSTRAINT "defi_borrowing_transaction_signature_key" UNIQUE("transaction_signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "new_asset_or_collection_request" (
	"request_id" serial PRIMARY KEY NOT NULL,
	"user_address" text NOT NULL,
	"asset_or_collection_name" text NOT NULL,
	"asset_or_collection" text NOT NULL,
	CONSTRAINT "new_asset_or_collection_request_request_id_key" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "te_user_stats" (
	"user_address" text PRIMARY KEY NOT NULL,
	"interestearned" varchar(255),
	"interestearnedlastmonth" varchar(255),
	"completedloans" varchar(225),
	"completedloanslastmonth" varchar(225),
	"activeloans" varchar(225),
	"activeloanslastmonth" varchar(225),
	"activeborrowingsvalue" varchar(225),
	"activeborrowingsvaluelastmonth" varchar(225),
	"activelendingvalue" varchar(225),
	"activelendingvaluelastmonth" varchar(225)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist" (
	"waitlist_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "waitlist_waitlist_id_key" UNIQUE("waitlist_id"),
	CONSTRAINT "waitlist_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" text NOT NULL,
	"email" text,
	"user_address" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone NOT NULL,
	"on_chain_credit_score" double precision,
	CONSTRAINT "users_pkey" PRIMARY KEY("user_id","user_address"),
	CONSTRAINT "users_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "users_user_address_key" UNIQUE("user_address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "defi_lending" ADD CONSTRAINT "defi_lending_lending_token_asset_details_asset_symbol_fk" FOREIGN KEY ("lending_token") REFERENCES "public"."asset_details"("asset_symbol") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "defi_lending" ADD CONSTRAINT "defi_lending_user_address_users_user_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("user_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "defi_borrowing" ADD CONSTRAINT "defi_borrowing_borrowing_token_asset_details_asset_symbol_fk" FOREIGN KEY ("borrowing_token") REFERENCES "public"."asset_details"("asset_symbol") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "defi_borrowing" ADD CONSTRAINT "defi_borrowing_user_address_users_user_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("user_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "new_asset_or_collection_request" ADD CONSTRAINT "new_asset_or_collection_request_user_address_users_user_address" FOREIGN KEY ("user_address") REFERENCES "public"."users"("user_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "te_user_stats" ADD CONSTRAINT "te_user_stats_user_address_users_user_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("user_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/