# Troubleshooting Guide

Solutions to common issues when developing, deploying, or running the survey system.

## Development Setup Issues

### PostgreSQL Connection Errors

**Error: `psql: error: could not translate host name "localhost" to address`**

**Cause**: PostgreSQL service not running or hostname resolution issue.

**Solution**:
```bash
# Windows - Check if PostgreSQL service is running
net start postgresql-x64-14  # Replace 14 with your version

# Linux/macOS - Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux

# Test connection
psql -U postgres -h localhost
```

**Alternative**: Use IP address instead of hostname
```bash
# In .env file
DB_HOST=127.0.0.1  # Instead of localhost
```

---

**Error: `FATAL: Ident authentication failed`**

**Cause**: PostgreSQL authentication method mismatch.

**Solution**:
1. Find `pg_hba.conf` file:
   - **Windows**: `C:\Program Files\PostgreSQL\14\data\pg_hba.conf`
   - **Linux**: `/etc/postgresql/14/main/pg_hba.conf`
   - **macOS**: `/usr/local/var/postgres/pg_hba.conf`

2. Edit the file and change authentication method:
   ```
   # Find line like: local   all             all                                     ident
   # Change to:      local   all             all                                     md5
   # Or:              local   all             all                                     trust
   ```

3. Restart PostgreSQL
   - **Windows**: `net stop postgresql-x64-14` then `net start postgresql-x64-14`
   - **Linux**: `sudo systemctl restart postgresql`
   - **macOS**: `brew services restart postgresql`

---

**Error: `password authentication failed for user "postgres"`**

**Cause**: Incorrect database password in `.env` file.

**Solution**:
```bash
# Reset PostgreSQL password
psql -U postgres

# In psql prompt:
ALTER USER postgres WITH PASSWORD 'new_password';
\q

# Update .env file
DB_PASSWORD=new_password
```

---

### Node Dependencies Issues

**Error: `npm ERR! code E404` or `npm ERR! 404 Not Found`**

**Cause**: Package not found in npm registry.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Check for typos in package.json
cat package.json | grep "dependencies"
```

---

**Error: `EACCES: permission denied` when installing**

**Cause**: npm permission issue (Linux/macOS).

**Solution**:
```bash
# Use sudo (not recommended long-term)
sudo npm install

# Or fix npm permissions properly
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install
```

---

**Error: Very large `node_modules` folder**

**Cause**: Normal; dependencies can be large.

**Solution**:
```bash
# This is expected behavior. Ensure gitignore ignores it:
cat .gitignore | grep node_modules

# Remove from git if accidentally committed
git rm -r --cached node_modules
git add .
git commit -m "Remove node_modules from git"
```

---

### Port Already in Use

**Error: `Error: listen EADDRINUSE :::3000` or `:::5000`**

**Cause**: Another process using the port.

**Solution**:

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID 1234 /F

# Or change the port
set PORT=3001
npm run dev:client
```

**Linux/macOS:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change the port
PORT=3001 npm run dev:client
```

---

### Database Schema Issues

**Error: `relation "surveys" does not exist`**

**Cause**: Database schema not initialized.

**Solution**:
```bash
# Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE survey_system;"

# Initialize schema using the template backup file
psql -U postgres -d survey_system < ../MARCH_2025_TEMPLATEBACKUP.sql

# Or use the context template if backup unavailable:
# psql -U postgres -d survey_system < context/db_template_survey.sql

# Verify tables were created
psql -U postgres -d survey_system -c "\dt"
```

---

**Error: `column "xyz" does not exist`**

**Cause**: Schema mismatch or old schema version.

**Solution**:
```bash
# Backup existing data (if needed)
pg_dump -U postgres survey_system > backup.sql

# Drop and recreate database
psql -U postgres -c "DROP DATABASE survey_system;"
psql -U postgres -c "CREATE DATABASE survey_system;"

# Reinitialize using template backup
psql -U postgres -d survey_system < ../MARCH_2025_TEMPLATEBACKUP.sql

# Or use the context template:
# psql -U postgres -d survey_system < context/db_template_survey.sql
```

---

## Frontend Development Issues

### React App Won't Start

**Error: `npm: command not found` or similar**

**Cause**: Node.js not installed or not in PATH.

**Solution**:
```bash
# Verify Node.js installed
node --version
npm --version

# If not found, install from nodejs.org
# Then restart terminal/IDE
```

---

**Error: `ENOENT: no such file or directory, open '.../public/index.html'`**

**Cause**: React app structure corrupted.

**Solution**:
```bash
# Verify folder structure
ls client/public/index.html

# If missing, check if created correctly
rm -rf client
git checkout client
npm install
```

---

**Error: React DevTools not showing**

**Cause**: Development mode not active.

**Solution**:
```bash
# Ensure NODE_ENV is development
echo NODE_ENV

# Start in dev mode
npm run dev:client

# Not production build
npm run build  # (Don't run this during development)
```

---

### Styling Issues

**Error: CSS not loading or styles not applied**

**Cause**: CSS file not imported or Styled Components issue.

**Solution**:
```bash
# Check if CSS is imported in component
grep -r "import.*\.css" client/src/

# Check browser DevTools:
# - Open Inspector
# - Check Styles tab
# - Look for red "Not Loaded" messages
# - Check Network tab for 404 errors

# Clear browser cache
# - Chrome: Cmd+Shift+Delete (macOS) or Ctrl+Shift+Delete (Windows/Linux)
# - Select "All time" and "Cached images and files"
```

---

## Backend Development Issues

### Express Server Won't Start

**Error: `Cannot find module 'express'` or similar**

**Cause**: Dependencies not installed in server directory.

**Solution**:
```bash
cd server
npm install
cd ..

# Or use root command
npm run server:install
```

---

**Error: `listen EADDRINUSE :::5000`**

**Cause**: Server port already in use.

**Solution**: (See "Port Already in Use" above)

---

**Error: `Error: ENOENT: no such file or directory ... config/db.js`**

**Cause**: Configuration files missing.

**Solution**:
```bash
# Check if config file exists
ls server/config/db.js

# If missing, restore from git
git checkout server/config/db.js
```

---

### Database Connection in Backend

**Error: `Error: connect ECONNREFUSED 127.0.0.1:5432`**

**Cause**: PostgreSQL not running or connection details wrong.

**Solution**:
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check connection details in .env
cat .env | grep DB_

# Test connection from Node
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'survey_system'
});
pool.query('SELECT NOW()', (err, res) => {
  console.log(err || res.rows);
  process.exit();
});
"
```

---

**Error: `FATAL: role "postgres" does not exist`**

**Cause**: PostgreSQL user/role not created.

**Solution**:
```bash
# Connect as default user
psql -U postgres  # May need -h 127.0.0.1

# If that fails, check PostgreSQL service is running
# Then create role
createuser -P postgres
```

---

### Session Issues

**Error: `Error: ENOENT: no such file or directory ... /tmp/sessions.json`**

**Cause**: Session storage directory missing or wrong configuration.

**Solution**:
```bash
# Ensure session configuration in server.js uses proper store
# For development, memory store is fine (not persistent)
# For production, use database session store

# Check server.js for session middleware
grep -A5 "express-session" server/server.js
```

---

## Testing Issues

**Error: `Test suite failed to compile`**

**Cause**: Jest configuration issue or missing dependencies.

**Solution**:
```bash
# Install jest
npm install --save-dev jest

# Run tests with verbose output
npm test -- --verbose

# Check jest config in package.json
cat package.json | grep -A10 '"jest"'
```

---

**Error: `Can't find module for selector`**

**Cause**: Test importing non-existent file.

**Solution**:
```bash
# Check file paths in test files
grep -r "import.*from" __tests__/

# Verify files exist
ls server/controllers/surveyController.js

# Update import paths if wrong
```

---

## Docker Issues

**Error: `docker: command not found`**

**Cause**: Docker not installed.

**Solution**:
```bash
# Install Docker
# Windows/macOS: https://www.docker.com/products/docker-desktop
# Linux: apt-get install docker.io

# Verify installation
docker --version
```

---

**Error: `Error response from daemon: Conflict ... port 5000`**

**Cause**: Docker container already using port.

**Solution**:
```bash
# List running containers
docker ps

# Stop container
docker stop <CONTAINER_ID>

# Or use different port
docker run -p 5001:5000 survey-system-unified
```

---

**Error: `Build failed: permission denied` when reading files**

**Cause**: File permissions or .dockerignore excluding needed files.

**Solution**:
```bash
# Check .dockerignore
cat .dockerignore

# Ensure it doesn't exclude critical files:
# - Keep out: node_modules, .env, .git
# - Keep in: package.json, source code

# Fix permissions if needed
chmod 644 Dockerfile
chmod 755 scripts/
```

---

## Deployment Issues

**Error: Container starts then immediately stops**

**Cause**: Application error on startup.

**Solution**:
```bash
# Check logs
docker logs <CONTAINER_ID>

# Run with interactive terminal
docker run -it survey-system-unified /bin/bash

# Check environment variables
docker run -it -- env
```

---

**Error: Nginx 502 Bad Gateway**

**Cause**: Node.js server not responding or port wrong.

**Solution**:
1. Verify Node.js server is running:
   ```
   docker exec <CONTAINER_ID> ps aux | grep node
   ```

2. Check Nginx config points to correct port:
   ```bash
   # In docker container
   grep "upstream" /etc/nginx/nginx.conf

   # Should be: upstream app { server localhost:5000; }
   ```

3. Test Node.js port from within container:
   ```bash
   docker exec <CONTAINER_ID> curl http://localhost:5000
   ```

---

**Error: `ECONNREFUSED` when accessing deployed app**

**Cause**: App not responding or load balancer routing wrong.

**Solution**:
1. Verify service is running (check platform dashboard)
2. Check logs for errors (see platform-specific logging)
3. Verify environment variables set correctly
4. Test database connection from logs
5. Check firewall/security groups allow traffic

---

## Common Error Messages & Solutions

| Error | Likely Cause | Solution |
|-------|------|----------|
| `EADDRINUSE` | Port in use | Kill process or use different port |
| `ECONNREFUSED` | Service not running | Start service/check configuration |
| `ENOENT` | File/folder not found | Check file exists, verify path |
| `FATAL: Ident authentication failed` | DB auth method | Edit `pg_hba.conf`, use md5/trust |
| `Cannot find module` | Dependency missing | Run `npm install` |
| `SyntaxError` | Code error | Check error location, fix syntax |
| `CORS error` | Cors configuration | Check CORS middleware in server.js |
| `401 Unauthorized` | Auth issue | Verify session, check credentials |
| `404 Not Found` | Route missing | Check route definition, verify endpoint |
| `500 Internal Server Error` | Server error | Check server logs for details |

---

## Getting More Help

1. **Check relevant documentation:**
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Setup instructions
   - [ARCHITECTURE.md](ARCHITECTURE.md) - How system works
   - [HANDOFF.md](HANDOFF.md) - Known issues

2. **Enable debug logging:**
   ```bash
   # In .env or command
   NODE_DEBUG=*  # Verbose Node.js debugging
   DEBUG=*       # General debugging
   ```

3. **Check logs:**
   - **Frontend**: Browser console (F12)
   - **Backend**: Terminal output or `server/logs/` if configured
   - **Database**: PostgreSQL logs

4. **Search existing issues:**
   - GitHub Issues in this repository
   - Stack Overflow for similar error messages

5. **Get stack traces:**
   ```bash
   # Run with better error output
   npm test -- --no-coverage
   NODE_ENV=development npm run dev
   ```

---

## Still Need Help?

If your issue isn't covered here:

1. Gather information:
   - Error message (full text)
   - Steps to reproduce
   - Environment (OS, Node version, npm version)
   - Relevant log snippets

2. Create an issue on GitHub with:
   - Clear title
   - Error description
   - Minimal reproduction steps
   - Environment details
   - Relevant logs/screenshots

3. Contact the development team:
   - Email: [contact info from TEAM_HANDOFF.md]
   - Slack/Discord: [chat channel if available]
