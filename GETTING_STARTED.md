# Getting Started - First Time Setup

Complete step-by-step guide for first-time team members to get the survey system running locally.

**Time estimate:** 1-2 hours (mostly waiting for downloads/installs)

## Prerequisites Checklist

Before starting, verify you have:

- [ ] Windows/macOS/Linux machine (with 8GB+ RAM)
- [ ] Git installed (`git --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] PostgreSQL 12+ installed and running (`psql --version`)
- [ ] Administrator/sudo access for system setup
- [ ] Access to repository (clone link ready)

### Installation Links
- **Git:** https://git-scm.com/
- **Node.js:** https://nodejs.org/ (choose LTS)
- **PostgreSQL:** https://www.postgresql.org/download/

---

## Step 1: Clone the Repository (5 min)

```bash
# Choose your workspace location
cd ~/Projects  # or wherever you keep code

# Clone the repository
git clone <repository-url>
cd survey-system
```

**Verify:** You should see `survey-system-unified/`, `.github/`, `scripts/`, and documentation files.

---

## Step 2: Verify Prerequisites (5 min)

### Check Versions
```bash
node --version      # Should be v18 or higher
npm --version       # Should be 8 or higher
psql --version      # Should be 12 or higher
git --version       # Should be 2.30 or higher
```

### Check PostgreSQL is Running

**macOS:**
```bash
brew services list | grep postgres
# Should show: postgres started /path/to/homebrew.macheysoftware.com/opt/postgresql@14/...
```

**Linux:**
```bash
sudo systemctl status postgresql
# Should show: active (running)
```

**Windows:**
- Open Services (services.msc)
- Look for "PostgreSQL" service
- Should show status "Running"

If not running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows - use Services GUI
```

---

## Step 3: Create PostgreSQL Database (5 min)

### Connect to PostgreSQL
```bash
# This should open a PostgreSQL prompt (psql>)
psql -U postgres

# If prompt asks for password, enter your PostgreSQL password
```

### Create the Database
```sql
-- Copy-paste these commands in psql prompt:

CREATE DATABASE survey_system;
\q  -- Press Enter to quit psql
```

**Verify:** Back in your terminal, check the database was created:
```bash
psql -U postgres -d survey_system -c "SELECT 1"
# Should print: 1 (one row)
```

---

## Step 4: Initialize Database Schema (5 min)

The template database is located in **MARCH_2025_TEMPLATEBACKUP.sql** (root directory backup).

```bash
# From your survey-system directory
cd survey-system-unified

# Initialize the schema using the template backup
psql -U postgres -d survey_system < ../MARCH_2025_TEMPLATEBACKUP.sql

# Or use the context template file if the backup is not available:
# psql -U postgres -d survey_system < context/db_template_survey.sql

# Verify tables were created
psql -U postgres -d survey_system -c "\dt"
```

**You should see:**
- `surveys`
- `responses`
- `users`
- `sections`
- `questions`
- And other tables

---

## Step 5: Setup Environment File (5 min)

```bash
# Still in survey-system-unified/
cp .env.example .env

# Edit .env file with your database info
# Windows: notepad .env
# macOS/Linux: nano .env (or your favorite editor)
```

**Update these values in .env:**
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password  # Password you set when installing PostgreSQL
DB_NAME=survey_system
DB_PORT=5432
NODE_ENV=development
PORT=5000

# Generate SESSION_SECRET with this command:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then paste the output here:
SESSION_SECRET=paste_generated_value_here
```

**Tip:** For local development, the defaults work fine. The SESSION_SECRET is important (generate a new one as shown).

---

## Step 6: Install Dependencies (10-15 min)

```bash
# Still in survey-system-unified/
npm run install:all

# This will:
# - Install root dependencies (concurrently)
# - Install client/ dependencies
# - Install server/ dependencies
#
# Watch for "added X packages" messages indicating success
```

**Common issues:**
- "npm: command not found" → Node.js not installed correctly
- "EACCES: permission denied" → Try `sudo npm install`
- "Network timeout" → Check internet connection, retry

---

## Step 7: Start Development Servers (2 min)

```bash
# Still in survey-system-unified/
npm run dev

# You should see both servers starting:
# [concurrently] Starting...
# [0] (client server starting)
# [1] (backend server starting)
```

**Look for success messages:**
- Backend: `Express server running on port 5000`
- Frontend: `webpack compiled...` or similar

**This will take 30-60 seconds the first time.**

---

## Step 8: Verify Installation (5 min)

### Check Frontend

1. Open browser: **http://localhost:3000**
2. You should see the survey form
3. Try filling it out (test submission)

### Check Backend

```bash
# In a NEW terminal (don't close the npm run dev terminal!)
curl http://localhost:5000/api/health

# Should return a response (may be JSON or HTML, that's OK)
```

### Check Database

```bash
# In the same new terminal
psql -U postgres -d survey_system -c "SELECT COUNT(*) FROM surveys;"

# Should return: count | 0 (or small number)
```

---

## Step 9: Admin Dashboard (Optional)

To test admin login (requires database setup):

1. Browser: **http://localhost:3000/admin** (or check routes in UI)
2. Default credentials: (Check with team or HANDOFF.md)
3. Try logging in
4. View admin dashboard

**Note:** Admin user may need to be created in database first. See [HANDOFF.md](HANDOFF.md) if login doesn't work.

---

## You're Ready! 🎉

Congratulations! You have:
- ✅ Cloned the repository
- ✅ Set up PostgreSQL database
- ✅ Initialized schema
- ✅ Installed dependencies
- ✅ Started development servers
- ✅ Verified everything works

---

## Next Steps

### Learn the System
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand code structure
2. Explore `survey-system-unified/client/src/components/` to see React components
3. Review `survey-system-unified/server/routes/` to see API endpoints
4. Check `survey-system-unified/context/db_template_survey.sql` to understand database

### Make a Change
1. Edit a React component: `survey-system-unified/client/src/components/`
2. Watch browser auto-reload at http://localhost:3000
3. Edit server code: `survey-system-unified/server/`
4. Server will auto-reload (or you may need to restart)

### Run Tests
```bash
npm test
```

### Try Deployment
1. Follow [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for your platform (GCP/DO/AWS)
2. Start with staging environment first
3. Test in staging before assuming production

---

## Common First-Time Issues

### "Cannot connect to PostgreSQL"
- [ ] Verify PostgreSQL is running (Step 2)
- [ ] Verify database exists (Step 3)
- [ ] Check password in .env matches your PostgreSQL password
- [ ] Try connecting directly: `psql -U postgres` (should work)

### "Relation 'surveys' does not exist"
- [ ] Schema wasn't initialized (re-do Step 4)
- [ ] Check you're connected to correct database: `psql -U postgres -d survey_system`
- [ ] Verify tables exist: `psql -U postgres -d survey_system -c "\dt"`

### "Port 3000 or 5000 already in use"
- [ ] Another app using the port (kill it or use different port)
- [ ] See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for kill commands
- [ ] Or change PORT in .env: `PORT=3001 npm run dev:client`

### "npm: command not found"
- [ ] Node.js not installed
- [ ] Installed but not in PATH
- [ ] Try restarting terminal after installing Node

### "Module not found" errors
- [ ] Run `npm run install:all` again
- [ ] Delete `node_modules/` and `package-lock.json`, reinstall
- [ ] Check internet connection for npm registry access

### Frontend won't load at localhost:3000
- [ ] Verify terminal shows webpack compiled successfully
- [ ] Check browser console (F12) for errors
- [ ] Verify Port 3000 not used by another app
- [ ] Clear browser cache (Cmd/Ctrl+Shift+Delete)

---

## Getting Help

**If something doesn't work:**

1. **Check this document** - Retrace your steps
2. **Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and fixes
3. **Search the code** - Error message may reference specific file
4. **Check [HANDOFF.md](HANDOFF.md)** - Known issues listed there
5. **Ask your team** - They may have encountered it before

---

## Next: Understand the System

Once everything is running, spend time understanding:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - How all pieces fit together
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - More detailed setup guide
- **Code exploration** - Browse the directories and read some source code
- **[HANDOFF.md](HANDOFF.md)** - What's incomplete and opportunities for improvement

You're now part of the development team! 🚀

---

## Advanced: Useful Development Commands

After setup works:

```bash
# In survey-system-unified/ directory:

# Start just backend (if you only need to test API)
npm run dev:server

# Start just frontend (in separate terminal)
npm run dev:client

# Run tests
npm test

# Build for production
npm run build

# Build Docker image
npm run docker:build

# Run Docker container locally
npm run docker:run
```

---

## Troubleshooting Commands

```bash
# Check Node/npm versions
node --version
npm --version

# Check PostgreSQL
psql -U postgres -c "SELECT version();"

# List databases
psql -U postgres -c "\l"

# Check current database
psql -U postgres -d survey_system -c "SELECT current_database();"

# Clear npm cache (if install issues)
npm cache clean --force

# Kill process using port (macOS/Linux)
lsof -i :3000  # Find process on port 3000
kill -9 <PID>  # Kill it

# Kill port on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

**Ready to start?** Begin at [Step 1](#step-1-clone-the-repository-5-min) above!
