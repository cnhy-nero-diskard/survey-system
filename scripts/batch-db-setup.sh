#!/bin/bash

# Survey System Batch Database Operations
# Handles multiple environment setup in one pass
# Usage: ./batch-db-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TEMPLATE_FILE="../survey-system-unified/server/db/schema/db_template_survey.sql"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  Survey System Batch DB Setup          ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo "This script will help set up PostgreSQL databases for:"
echo "  1. Development (local)"
echo "  2. Testing (local)"
echo "  3. Production (remote)"
echo ""

read -p "How many environments to set up? [1-3]: " ENV_COUNT

if [ -z "$ENV_COUNT" ] || ! echo "$ENV_COUNT" | grep -q "^[123]$"; then
    ENV_COUNT=1
fi

# Array to store environment info
declare -a ENVS_HOST
declare -a ENVS_USER
declare -a ENVS_PASS
declare -a ENVS_NAME

for ((i=1; i<=ENV_COUNT; i++)); do
    echo ""
    echo -e "${YELLOW}Environment $i:${NC}"
    
    read -p "  Host [localhost]: " HOST
    HOST="${HOST:-localhost}"
    ENVS_HOST[$i]="$HOST"
    
    read -p "  User [postgres]: " USER
    USER="${USER:-postgres}"
    ENVS_USER[$i]="$USER"
    
    read -sp "  Password: " PASS
    echo ""
    ENVS_PASS[$i]="$PASS"
    
    read -p "  Database name [survey_system]: " DBNAME
    DBNAME="${DBNAME:-survey_system}"
    ENVS_NAME[$i]="$DBNAME"
done

# Confirm all configurations
echo ""
echo -e "${YELLOW}Review configurations:${NC}"
for ((i=1; i<=ENV_COUNT; i++)); do
    echo "  [$i] ${ENVS_HOST[$i]} | ${ENVS_USER[$i]} | ${ENVS_NAME[$i]}"
done

read -p "Continue with setup? [y/n]: " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# Process each environment
for ((i=1; i<=ENV_COUNT; i++)); do
    echo ""
    echo -e "${BLUE}Setting up environment $i...${NC}"
    
    HOST="${ENVS_HOST[$i]}"
    USER="${ENVS_USER[$i]}"
    PASS="${ENVS_PASS[$i]}"
    DBNAME="${ENVS_NAME[$i]}"
    
    # Test connection
    if PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -tc "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Connection OK${NC}"
    else
        echo -e "${RED}  ✗ Connection failed${NC}"
        continue
    fi
    
    # Terminate existing connections
    PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -tc \
        "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DBNAME' AND pid <> pg_backend_pid();" 2>/dev/null || true
    
    # Drop existing database
    if PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DBNAME'" | grep -q 1; then
        echo -e "${YELLOW}  Dropping existing database...${NC}"
        PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -c "DROP DATABASE IF EXISTS $DBNAME;"
        echo -e "${GREEN}  ✓ Dropped${NC}"
    fi
    
    # Create database
    echo -e "${YELLOW}  Creating database...${NC}"
    PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -c "CREATE DATABASE $DBNAME;"
    echo -e "${GREEN}  ✓ Created${NC}"
    
    # Initialize schema
    echo -e "${YELLOW}  Initializing schema...${NC}"
    if PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -d "$DBNAME" -f "$TEMPLATE_FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Schema initialized${NC}"
    else
        echo -e "${RED}  ✗ Schema initialization failed${NC}"
        continue
    fi
    
    # Verify
    TABLE_COUNT=$(PGPASSWORD="$PASS" psql -h "$HOST" -U "$USER" -d "$DBNAME" -tc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo -e "${GREEN}  ✓ Environment $i ready ($TABLE_COUNT tables)${NC}"
done

echo ""
echo -e "${GREEN}✓ Batch setup complete!${NC}"
