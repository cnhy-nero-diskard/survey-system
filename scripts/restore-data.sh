#!/bin/bash

# Survey System Database Import/Restore Script
# Usage: ./restore-data.sh [TARGET_HOST] [TARGET_USER] [TARGET_DB] [INPUT_FILE]
# Example: ./restore-data.sh localhost postgres survey_system backup.sql

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
TARGET_HOST="${1:-localhost}"
TARGET_USER="${2:-postgres}"
TARGET_DB="${3:-survey_system}"
INPUT_FILE="${4}"

# Validate input file
if [ -z "$INPUT_FILE" ]; then
    echo -e "${RED}Error: INPUT_FILE is required${NC}"
    echo "Usage: $0 [TARGET_HOST] [TARGET_USER] [TARGET_DB] [INPUT_FILE]"
    echo "Example: $0 localhost postgres survey_system backup.sql"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}Error: File not found: $INPUT_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Survey System Database Restore${NC}"
echo "========================================"
echo "Target host: $TARGET_HOST"
echo "Target user: $TARGET_USER"
echo "Target database: $TARGET_DB"
echo "Input file: $INPUT_FILE"
echo ""

# Prompt for password
read -sp "Enter PostgreSQL password for $TARGET_USER: " TARGET_PASSWORD
echo ""

# Test connection
echo -e "${YELLOW}Testing database connection...${NC}"
if PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -d "$TARGET_DB" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    exit 1
fi

# Confirm destructive operation
echo -e "${YELLOW}⚠ WARNING: This will DROP and recreate all tables in $TARGET_DB${NC}"
read -p "Are you sure? Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# Check if database exists
echo -e "${YELLOW}Checking target database...${NC}"
if PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$TARGET_DB'" | grep -q 1; then
    echo -e "${YELLOW}Database exists. Dropping and recreating...${NC}"
    
    PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -tc \
        "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$TARGET_DB' AND pid <> pg_backend_pid();" 2>/dev/null || true
    
    PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -c "DROP DATABASE IF EXISTS $TARGET_DB;" 
    echo -e "${GREEN}✓ Dropped existing database${NC}"
else
    echo -e "${YELLOW}Database does not exist. Creating new...${NC}"
fi

# Create new database
echo -e "${YELLOW}Creating database...${NC}"
PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -c "CREATE DATABASE $TARGET_DB;"
echo -e "${GREEN}✓ Database created${NC}"

# Restore from file
echo -e "${YELLOW}Restoring data from $INPUT_FILE...${NC}"
if PGPASSWORD="$TARGET_PASSWORD" psql \
    -h "$TARGET_HOST" \
    -U "$TARGET_USER" \
    -d "$TARGET_DB" \
    -f "$INPUT_FILE" \
    --set ON_ERROR_STOP=on \
    > /tmp/restore.log 2>&1; then
    
    echo -e "${GREEN}✓ Restore completed${NC}"
    
    # Verify
    echo -e "${YELLOW}Verifying restored data...${NC}"
    TABLE_COUNT=$(PGPASSWORD="$TARGET_PASSWORD" psql -h "$TARGET_HOST" -U "$TARGET_USER" -d "$TARGET_DB" -tc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo -e "${GREEN}✓ Tables found: $TABLE_COUNT${NC}"
    
    echo ""
    echo -e "${GREEN}✓ Restore complete!${NC}"
    echo "Target database: $TARGET_DB"
    
else
    echo -e "${RED}✗ Restore failed${NC}"
    echo "Check /tmp/restore.log for details"
    tail -20 /tmp/restore.log
    exit 1
fi
