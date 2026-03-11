# Development Setup Guide

This guide walks you through setting up the survey system for local development.

## Prerequisites

Before starting, ensure you have:
- **Node.js**: 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: 8.0.0 or higher (comes with Node.js)
- **PostgreSQL**: 12.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: For cloning the repository

**Verify your versions:**
```bash
node --version
npm --version
psql --version
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd survey-system
cd survey-system-unified
```

## Step 2: Environment Configuration

### Copy Environment Template
```bash
cp .env.example .env
```

### Edit `.env` with Your Settings

Open `.env` and configure the following variables:

**Database Configuration:**
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=survey_system
DB_PORT=5432
```

**Server Configuration:**
```env
NODE_ENV=development
PORT=5000
```

**Session & Security (Generate new values):**
```bash
# Generate a secure session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then set:
```env
SESSION_SECRET=<generated-value-from-above>
```

**Optional API Keys (for email and AI features):**
```env
# SendGrid (optional, for email)
SENDGRID_API_KEY=your_sendgrid_key

# Hugging Face (optional, for AI features)
HUGGING_FACE_API_KEY=your_hugging_face_key
```

## Step 3: Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, create the database
CREATE DATABASE survey_system;
\q
```

### Initialize Database Schema

**Template Database Location:** The template database schema is located in `MARCH_2025_TEMPLATEBACKUP.sql` (see [MARCH_2025_TEMPLATEBACKUP.sql](MARCH_2025_TEMPLATEBACKUP.sql))

```bash
# From the survey-system-unified directory
# Using the template backup file
psql -U postgres -d survey_system < ../MARCH_2025_TEMPLATEBACKUP.sql

# Or using the context template
psql -U postgres -d survey_system < context/db_template_survey.sql
```

**Verify the schema was created:**
```bash
psql -U postgres -d survey_system -c "\dt"
```

You should see tables like `surveys`, `responses`, `users`, etc.

## Step 4: Install Dependencies

### Option A: Using the Setup Script (Recommended)

**Windows:**
```bash
scripts\setup-dev.bat
```

**Linux/macOS:**
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### Option B: Manual Installation

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

## Step 5: Start Development Servers

From the `survey-system-unified` directory:

### Start Both Frontend and Backend Together
```bash
npm run dev
```

This starts:
- **React Frontend**: http://localhost:3000
- **Node.js Backend**: http://localhost:5000

### Or Start Individually

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```
Runs on `http://localhost:5000`

**Terminal 2 - Frontend (in another terminal):**
```bash
npm run dev:client
```
Runs on `http://localhost:3000`

## Step 6: Verify Installation

### Check Frontend
1. Open http://localhost:3000 in your browser
2. You should see the survey form
3. Try submitting a test survey

### Check Backend
```bash
curl http://localhost:5000/api/health
```
Should return a successful response (varies by endpoint)

### Check Database
```bash
psql -U postgres -d survey_system -c "SELECT COUNT(*) FROM surveys;"
```

## Step 7: Run Tests

```bash
npm test
```

This runs the server test suite using Jest.

## Available Development Commands

```bash
# Start both servers
npm run dev

# Start individual servers
npm run dev:server    # Backend on :5000
npm run dev:client    # Frontend on :3000

# Install dependencies
npm run install:all   # Install both client and server deps
npm run client:install
npm run server:install

# Build for production
npm run build
npm run client:build

# Run tests
npm test

# Docker commands
npm run docker:build
npm run docker:run
```

## Troubleshooting

### PostgreSQL Connection Errors

**Error: `psql: error: could not translate host name "localhost" to address`**
- Verify PostgreSQL is running: `psql -U postgres`
- Check connection details in `.env`
- On Windows, try `DB_HOST=127.0.0.1` instead

**Error: `FATAL: Ident authentication failed`**
- Edit `pg_hba.conf` (PostgreSQL config) to use `md5` or `trust` authentication
- Location varies by OS; see [PostgreSQL docs](https://www.postgresql.org/docs/current/auth-methods.html)

### Node Dependencies Issues

**Error: `npm ERR! code E404 ... not found`**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall: `npm install`

**Error: `node_modules` keeps growing**
- Ensure `.gitignore` includes `node_modules`
- This is normal; gitignored files won't be committed

### Port Already in Use

**Error: `Address already in use :::3000` or `:::5000`**
- Kill the process using the port:
  - **Windows**: `netstat -ano | findstr :3000` then `taskkill /PID <PID>`
  - **Linux/macOS**: `lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9`
- Or change port: `PORT=3001 npm run dev:client`

### Database Schema Issues

**Error: `relation "surveys" does not exist`**
- Reinitialize the schema: `psql -U postgres -d survey_system < context/db_template_survey.sql`
- Or drop and recreate:
  ```bash
  psql -U postgres -c "DROP DATABASE survey_system;"
  psql -U postgres -c "CREATE DATABASE survey_system;"
  psql -U postgres -d survey_system < context/db_template_survey.sql
  ```

## Next Steps

- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the codebase structure
- Review [README.md](survey-system-unified/README.md) for detailed feature documentation
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help

## Getting Help

If you encounter issues not covered here:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review error logs in `server/` or browser console
3. Search existing GitHub issues
4. See [HANDOFF.md](HANDOFF.md) for known issues and their workarounds
