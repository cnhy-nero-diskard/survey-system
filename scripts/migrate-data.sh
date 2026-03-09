#!/bin/bash

# Survey System Database Export & Migration Script
# Usage: ./migrate-data.sh [SOURCE_HOST] [SOURCE_USER] [SOURCE_DB] [OUTPUT_FILE]
# Example: ./migrate-data.sh prod-db.example.com postgres survey_system backup.sql

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
SOURCE_HOST="${1:-localhost}"
SOURCE_USER="${2:-postgres}"
SOURCE_DB="${3:-survey_system}"
OUTPUT_FILE="${4:-survey_system_backup_$(date +%Y%m%d_%H%M%S).sql}"

echo -e "${YELLOW}Survey System Database Export${NC}"
echo "========================================"
echo "Source host: $SOURCE_HOST"
echo "Source user: $SOURCE_USER"
echo "Source database: $SOURCE_DB"
echo "Output file: $OUTPUT_FILE"
echo ""

# Prompt for password
read -sp "Enter PostgreSQL password for $SOURCE_USER: " SOURCE_PASSWORD
echo ""

# Test connection
echo -e "${YELLOW}Testing database connection...${NC}"
if PGPASSWORD="$SOURCE_PASSWORD" psql -h "$SOURCE_HOST" -U "$SOURCE_USER" -d "$SOURCE_DB" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    exit 1
fi

# Perform export
echo -e "${YELLOW}Exporting database...${NC}"
if PGPASSWORD="$SOURCE_PASSWORD" pg_dump \
    -h "$SOURCE_HOST" \
    -U "$SOURCE_USER" \
    -d "$SOURCE_DB" \
    --verbose \
    --format=plain \
    --file="$OUTPUT_FILE"; then
    echo -e "${GREEN}✓ Export completed${NC}"
    
    # Get file size
    FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo -e "${GREEN}File size: $FILE_SIZE${NC}"
    
    # Compress the file
    echo -e "${YELLOW}Compressing backup...${NC}"
    gzip -v "$OUTPUT_FILE"
    
    COMPRESSED_FILE="${OUTPUT_FILE}.gz"
    COMPRESSED_SIZE=$(ls -lh "$COMPRESSED_FILE" | awk '{print $5}')
    echo -e "${GREEN}Compressed: $COMPRESSED_SIZE${NC}"
    
    echo ""
    echo -e "${GREEN}✓ Migration complete!${NC}"
    echo "Backup file: $COMPRESSED_FILE"
    echo ""
    echo "To restore this backup:"
    echo "  gunzip $COMPRESSED_FILE"
    echo "  ./restore-data.sh [TARGET_HOST] [TARGET_USER] [TARGET_DB] $OUTPUT_FILE"
    
else
    echo -e "${RED}✗ Export failed${NC}"
    rm -f "$OUTPUT_FILE"
    exit 1
fi
