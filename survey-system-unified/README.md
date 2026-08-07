# Survey System - Unified Deployment

A unified React frontend and Node.js backend application for conducting tourism surveys, merged into a single deployable unit to reduce cloud infrastructure costs.

## 🏗️ Architecture

### Original Structure (Separate Deployments)
```
surveymockup1/          → React frontend (separate deployment)
surveymockup1_backend/  → Node.js backend (separate deployment)
```

### New Unified Structure
```
survey-system-unified/
├── client/             → React frontend
├── server/             → Node.js backend
├── Dockerfile         → Single container for both
├── package.json       → Root scripts for dev/build
└── scripts/           → Setup utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone and Navigate**
   ```bash
   cd survey-system-unified
   ```

2. **Setup Environment**
   ```bash
   # Windows
   scripts\setup-dev.bat
   
   # Linux/macOS
   chmod +x scripts/setup-dev.sh
   ./scripts/setup-dev.sh
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and other settings
   ```

4. **Start Development**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start individually:
   npm run dev:client  # React dev server on :3000
   npm run dev:server  # Node.js server on :5000
   ```

### Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```
   The unified app will be available at `http://localhost:5000`

## 🐳 Docker Deployment

### Build and Run
```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Manual Docker Commands
```bash
# Build
docker build -t survey-system-unified .

# Run with environment file
docker run -p 5000:5000 --env-file .env survey-system-unified

# Run with environment variables
docker run -p 5000:5000 \
  -e DB_HOST=your_db_host \
  -e DB_PASSWORD=your_password \
  survey-system-unified
```

## 🔧 Configuration

### Environment Variables

### Secret generation and rotation

Generate four separate values for `JWT_SECRET`, `SESSION_SECRET`,
`CRYPTO_SECRET`, and `HMAC_SECRET`:

```bash
openssl rand -base64 32
```

Each value must be at least 32 characters and must be placed in the untracked
`.env` (or supplied through the corresponding `*_FILE` mount). Never commit
secret values. `SESSION_SECRET` rotation invalidates live sessions;
`JWT_SECRET` rotation invalidates issued admin tokens; neither requires a data
migration. `HMAC_SECRET` rotation requires any external admin-provisioning
caller to be re-keyed at the same time. `CRYPTO_SECRET` protects encrypted
`HF_TOKENS.apitoken` values: decrypt rows with the old secret and re-encrypt
them with the new one, or re-enter the tokens through the admin UI, before
switching secrets. Changing `CRYPTO_SECRET` alone makes existing tokens
undecryptable.

Any value ever used from a committed configuration must be treated as
disclosed and rotated. `docker-compose up` now requires a populated `.env`.

| Secret | Protects | Rotation effect | Data migration |
|---|---|---|---|
| `SESSION_SECRET` | Anonymous session cookies | Live sessions expire | No |
| `JWT_SECRET` | Admin JWTs | Issued admin tokens expire | No |
| `CRYPTO_SECRET` | AES-encrypted `HF_TOKENS.apitoken` values | Stored tokens must be re-encrypted or re-entered | Yes |
| `HMAC_SECRET` | Admin-provisioning request signatures | External callers must be re-keyed | No |

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production) | No | production |
| `PORT` | Server port | No | 5000 |
| `DB_HOST` | Database host | Yes | - |
| `DB_PORT` | Database port | No | 5432 |
| `DB_NAME` | Database name | Yes | - |
| `DB_USER` | Database user | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `SESSION_SECRET` | Session encryption key | Yes | - |
| `FRONTEND_URL` | External frontend URL (optional) | No | - |

### API Configuration Modes

The application automatically detects the deployment mode:

- **Development**: Uses `REACT_APP_API_HOST` if set, otherwise `http://localhost:5000`
- **Unified Production**: Uses relative paths (API calls go to same server)
- **Separate Production**: Uses `REACT_APP_API_HOST` environment variable

## 📁 Project Structure

```
survey-system-unified/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── config/        # API configuration
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                # Node.js Backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── config/           # Database config
│   └── package.json      # Backend dependencies
│
├── scripts/              # Development utilities
├── Dockerfile           # Multi-stage container build
├── docker-compose.yml   # Optional: full stack with DB
└── package.json         # Root project configuration
```

## 🧪 Testing

### Manual Testing Steps

1. **Development Mode Testing**
   ```bash
   # Start development servers
   npm run dev
   
   # Check frontend: http://localhost:3000
   # Check backend API: http://localhost:5000/api/health
   # Test API calls from frontend to backend
   ```

2. **Production Mode Testing**
   ```bash
   # Build and start production
   npm run build
   npm start
   
   # Check unified app: http://localhost:5000
   # Test all frontend routes (React Router)
   # Test API endpoints: http://localhost:5000/api/*
   # Verify static assets load correctly
   ```

3. **Docker Testing**
   ```bash
   # Build and test container
   npm run docker:build
   npm run docker:run
   
   # Check health: http://localhost:5000/api/health
   # Test application functionality
   ```

### Key Test Points

- ✅ Frontend loads and renders correctly
- ✅ API endpoints respond correctly
- ✅ Database connections work
- ✅ Authentication/sessions function
- ✅ File uploads work (if applicable)
- ✅ Client-side routing works in production
- ✅ API calls use correct URLs (relative in production)
- ✅ Environment variables load properly
- ✅ Docker container starts and runs
- ✅ Health check endpoint responds

## 🔍 Troubleshooting

### Common Issues

1. **API calls fail in production**
   - Check that frontend is using relative paths
   - Verify `apiConfig.js` is imported correctly
   - Check browser network tab for failed requests

2. **Static files not loading**
   - Verify React build completed successfully
   - Check Express static file configuration
   - Ensure paths in server.js are correct

3. **Database connection issues**
   - Verify environment variables are set
   - Check database server is running
   - Test connection string manually

4. **Port conflicts**
   - Change PORT environment variable
   - Check for other services using the same port
   - Update any hardcoded port references

### Debug Commands

```bash
# Check logs
docker logs <container_id>

# Inspect container
docker exec -it <container_id> /bin/sh

# Test database connection
node -e "import('./server/config/db.js').then(pool => pool.query('SELECT NOW()'))"

# Check API endpoints
curl http://localhost:5000/api/health
```

## 🌐 Deployment Options

### Cloud Run (Google Cloud)
```bash
# Build and push to registry
docker build -t gcr.io/YOUR_PROJECT/survey-system .
docker push gcr.io/YOUR_PROJECT/survey-system

# Deploy to Cloud Run
gcloud run deploy survey-system \
  --image gcr.io/YOUR_PROJECT/survey-system \
  --platform managed \
  --port 5000 \
  --set-env-vars NODE_ENV=production
```

### Railway
```bash
# Connect your repository and configure environment variables
# Railway will automatically detect the Dockerfile
```

### Heroku
```bash
# Add Heroku remote and deploy
heroku create your-app-name
git push heroku main
```

## 🔐 Security Considerations

- Use strong `SESSION_SECRET` in production
- Enable HTTPS in production environments
- Configure CORS origins appropriately
- Use environment variables for all secrets
- Regular security updates for dependencies
- Database connection encryption

## 🤝 Migration from Separate Deployments

If migrating from separate frontend/backend deployments:

1. Update environment variables in both deployments
2. Test the unified version thoroughly
3. Switch DNS/load balancer to unified deployment
4. Monitor for any issues
5. Decommission old separate deployments

## 📊 Monitoring

### Health Checks
- `GET /api/health` - Application health status
- Docker health check included in Dockerfile
- Monitor memory and CPU usage

### Logging
- Application logs via Winston
- Console logs in development
- Container logs available via Docker

---

## 📝 Development Notes

### Key Changes Made During Migration

1. **Server Configuration**
   - Added static file serving for React build
   - Updated CORS to handle unified deployment
   - Added catch-all route for client-side routing

2. **Frontend Configuration**
   - Created `apiConfig.js` for dynamic API URL handling
   - Updated all API calls to use `getApiUrl()`
   - Conditional logic for development vs production

3. **Build Process**
   - Multi-stage Dockerfile for efficient builds
   - Combined package.json scripts
   - Automated dependency installation

This unified approach reduces deployment complexity and costs while maintaining all the functionality of the original separate deployments.
