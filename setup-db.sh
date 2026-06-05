#!/bin/bash

# Kolo App - Database Setup Script
# This script initializes the PostgreSQL database with schema and seed data

set -e

echo "================================"
echo "Kolo App - Database Setup"
echo "================================"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql (PostgreSQL client) is not installed."
    echo "Please install PostgreSQL client tools."
    exit 1
fi

# Database configuration from environment or defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-kolo_user}
DB_PASSWORD=${DB_PASSWORD:-kolo_password_dev}
DB_NAME=${DB_NAME:-kolo_db}

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Set password for psql
export PGPASSWORD=$DB_PASSWORD

echo "Creating database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE DATABASE $DB_NAME;" || \
  echo "Database already exists or could not be created"

echo "Running schema migrations..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f packages/db/schema.sql

echo "Seeding database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f packages/db/seed.sql

# Unset password
unset PGPASSWORD

echo ""
echo "================================"
echo "✓ Database setup complete!"
echo "================================"
echo ""
echo "Connection string:"
echo "  postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME"
