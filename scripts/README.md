# Database & Utility Scripts

Helper scripts for database management, migrations, and development tasks.

## Available Scripts

### 1. `migrate-data.sh` (Linux/macOS)
**Export survey data from existing database**

**Purpose:** Create a backup of all data (surveys, responses, users) from an existing environment.

**Usage:**
```bash
./migrate-data.sh [SOURCE_HOST] [SOURCE_USER] [SOURCE_DB] [OUTPUT_FILE]
```

**Examples:**
```bash
# Export from local development
./migrate-data.sh localhost postgres survey_system backup_dev.sql

# Export from production
./migrate-data.sh prod-db.example.com postgres survey_system prod_backup.sql

# Export with defaults (all will prompt if not provided)
./migrate-data.sh
```

**What it does:**
- Tests connection to source database
- Exports full database schema and data using `pg_dump`
- Compresses to `.gz` file for smaller size
- Outputs instructions for restore

**Output:** `survey_system_backup_YYYYMMDD_HHMMSS.sql.gz`

---

### 2. `restore-data.sh` (Linux/macOS)
**Import survey data to target database**

**Purpose:** Restore backup created by `migrate-data.sh` to a new environment.

**Usage:**
```bash
./restore-data.sh [TARGET_HOST] [TARGET_USER] [TARGET_DB] [INPUT_FILE]
```

**Examples:**
```bash
# Restore to local database
./restore-data.sh localhost postgres survey_system backup.sql

# Restore to staging
./restore-data.sh staging-db.example.com postgres survey_staging backup.sql
```

**⚠️ WARNING:** This will:
- Drop existing database if present
- Recreate from backup file
- Confirm before proceeding

**What it does:**
- Tests connection
- Terminates existing connections to prevent locks
- Drops and recreates target database
- Restores schema and data
- Verifies table count

---

### 3. `init-fresh-db.sh` (Linux/macOS)
**Create clean database from template**

**Purpose:** Create a new survey database with empty tables (no data).

**Usage:**
```bash
./init-fresh-db.sh [DB_HOST] [DB_USER] [DB_NAME]
```

**Examples:**
```bash
# Initialize local development database
./init-fresh-db.sh localhost postgres survey_system

# Initialize on remote host
./init-fresh-db.sh dev-db.example.com postgres survey_dev
```

**What it does:**
- Tests database connection
- Optionally drops existing database
- Creates new database
- Initializes schema from `context/db_template_survey.sql`
- Lists created tables

---

### 4. `batch-db-setup.sh` (Linux/macOS)
**Set up multiple database environments**

**Purpose:** Create developments, testing, and production databases in one script.

**Usage:**
```bash
./batch-db-setup.sh
```

**Interactive prompts:**
1. Number of environments to set up (1-3)
2. For each environment:
   - Database host
   - Database user
   - Database password
   - Database name
3. Confirmation before proceeding

**What it does:**
- Sets up multiple environments with one script
- Useful when preparing dev, staging, and production databases
- Terminates existing connections and drops old databases
- Initializes all from template

---

## Windows Batch Scripts

For Windows developers, use `.bat` file equivalents:

### **(Coming soon - Windows batch versions)**

For now, Windows users can:
1. Use Git Bash or WSL to run `.sh` scripts
2. Use the unified setup scripts in `survey-system-unified/scripts/`

---

## Database Template

**Location:** `survey-system-unified/context/db_template_survey.sql`

This file contains the complete PostgreSQL schema for the survey system:
- Tables (surveys, responses, users, localization, etc.)
- Indexes
- Sequences
- Constraints

All setup scripts use this template to initialize databases.

---

## Common Workflows

### Development Setup
```bash
# 1. Initialize fresh database
cd scripts
./init-fresh-db.sh

# 2. Application picks up environment variables in .env
cd ../survey-system-unified
npm run dev
```

### Backup Before Major Changes
```bash
cd scripts
./migrate-data.sh localhost postgres survey_system backup_before_changes.sql
```

### Restore After Failed Deployment
```bash
cd scripts
./restore-data.sh prod-db.example.com postgres survey_system backup.sql
```

### Multi-Environment Setup
```bash
./batch-db-setup.sh
# Follow prompts for each environment
```

### Migrate from Old to New Server
```bash
# On old server
./migrate-data.sh old-host.com user survey_db old_backup.sql

# Transfer old_backup.sql.gz to new server
# On new server
./restore-data.sh new-host.com user survey_db old_backup.sql
```

---

## Troubleshooting Scripts

### "Command not found"
Scripts need execution permission:
```bash
chmod +x *.sh
```

### "Permission denied: psql"
PostgreSQL tools not in PATH:
```bash
# Install PostgreSQL client tools
# macOS
brew install postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-client

# Linux (RHEL/CentOS)
sudo yum install postgresql
```

### "Connection refused"
Database server not running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Verify
psql -U postgres -c "SELECT 1"
```

### "Password authentication failed"
Wrong password provided:
```bash
# Reset PostgreSQL password
psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
\q

# Update .env with new password
```

### "Database does not exist"
Database hasn't been created yet:
```bash
# Create it
./init-fresh-db.sh
```

### Export creates huge file
Normal for large datasets; compress before transferring:
```bash
gzip survey_system_backup.sql

# Result: survey_system_backup.sql.gz (smaller)

# Transfer compressed file
scp survey_system_backup.sql.gz user@server:/tmp/

# Decompress on server
gunzip survey_system_backup.sql.gz
```

---

## Security Considerations

### Backup Files
- Contain full database including user passwords (hashed)
- Should be **encrypted** before transferring
- Store backups securely
- Don't commit to Git

**Encrypt a backup:**
```bash
gpg --symmetric survey_system_backup.sql
# Creates: survey_system_backup.sql.gpg
```

**Decrypt on target:**
```bash
gpg --decrypt survey_system_backup.sql.gpg > survey_system_backup.sql
./restore-data.sh localhost postgres survey_system survey_system_backup.sql
```

### Password Handling
- Never pass passwords in command line
- Scripts will prompt for password interactively
- Password not stored or logged
- Use SSH keys if available for remote connections

### Remote Connections
For production databases:
```bash
# Use SSH tunnel for secure connection
ssh -L 5432:prod-db.example.com:5432 user@bastion-host
# Then connect to localhost:5432
./migrate-data.sh localhost postgres survey_system backup.sql
```

---

## Advanced Usage

### Backup Scheduling (Linux)
```bash
# Add to crontab (backup daily at 2 AM)
crontab -e

# Add line:
0 2 * * * /path/to/scripts/migrate-data.sh prod-host user survey_system /backups/daily_backup.sql
```

### Selective Table Export
If only exporting specific tables:
```bash
# Export only responses (no surveys)
pg_dump -h localhost -U postgres survey_system --table=responses -f responses_only.sql

# Import specific tables only
```

### Testing Backups
Always test restore after backup:
```bash
# On test server
./restore-data.sh localhost postgres survey_test /path/to/backup.sql

# Verify data integrity
psql -U postgres -d survey_test -c "SELECT COUNT(*) FROM responses;"
```

---

## Related Documentation

- [DEVELOPMENT.md](../DEVELOPMENT.md) - Local setup (uses these scripts)
- [INFRASTRUCTURE.md](../INFRASTRUCTURE.md) - Deployment guides (references migration)
- [CREDENTIALS.md](../CREDENTIALS.md) - Database password management
