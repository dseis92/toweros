--
-- TowerOS Database Initialization
--
-- Creates initial database and extensions.
--

-- Create database (if not exists)
SELECT 'CREATE DATABASE toweros_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'toweros_dev')\gexec

-- Connect to database
\c toweros_dev

-- Enable PostGIS extension for spatial data (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension (optional, using ULID instead)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema for migrations tracking
CREATE SCHEMA IF NOT EXISTS drizzle;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE toweros_dev TO postgres;
