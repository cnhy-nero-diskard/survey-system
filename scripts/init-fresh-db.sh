#!/bin/bash

# Survey System Fresh Database Setup Script
# Creates a new, clean survey_system database from template
# Usage: ./init-fresh-db.sh [DB_HOST] [DB_USER] [DB_NAME]
# Example: ./init-fresh-db.sh localhost postgres survey_system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
DB_HOST="${1:-localhost}"
DB_USER="${2:-postgres}"
DB_NAME="${3:-survey_system}"
TEMPLATE_FILE="../survey-system-unified/server/db/schema/db_template_survey.sql"

echo -e "${YELLOW}Survey System Fresh Database Initialization${NC}"
echo "========================================"
echo "Database host: $DB_HOST"
echo "Database user: $DB_USER"
echo "Database name: $DB_NAME"
echo "Template file: $TEMPLATE_FILE"
echo ""

# Check template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${RED}Error: Template file not found: $TEMPLATE_FILE${NC}"
    exit 1
fi

# Prompt for password
read -sp "Enter PostgreSQL password for $DB_USER: " DB_PASSWORD
echo ""

# Test connection
echo -e "${YELLOW}Testing database connection...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -tc "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    exit 1
fi

# Check if database exists
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists${NC}"
    read -p "Drop and recreate? (yes/no): " RECREATE
    
    if [ "$RECREATE" = "yes" ]; then
        echo -e "${YELLOW}Terminating existing connections...${NC}"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -tc \
            "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();" 2>/dev/null || true
        
        echo -e "${YELLOW}Dropping database...${NC}"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
        echo -e "${GREEN}✓ Dropped${NC}"
    else
        echo "Using existing database."
    fi
fi

# Create database
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo -e "${YELLOW}Creating database...${NC}"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi

# Initialize schema
echo -e "${YELLOW}Initializing schema from template...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f "$TEMPLATE_FILE" \
    --set ON_ERROR_STOP=on > /dev/null 2>&1; then
    
    echo -e "${GREEN}✓ Schema initialized${NC}"
    
    # Verify
    echo -e "${YELLOW}Verifying tables...${NC}"
    TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    echo -e "${GREEN}✓ Tables created: $TABLE_COUNT${NC}"
    
    # List tables
    echo ""
    echo -e "${YELLOW}Database structure:${NC}"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "\dt public.*"
    
    echo ""
    echo -e "${GREEN}✓ Fresh database initialized!${NC}"
    echo "Connection string: postgresql://$DB_USER@$DB_HOST/$DB_NAME"
    
else
    echo -e "${RED}✗ Schema initialization failed${NC}"
    exit 1
fi
