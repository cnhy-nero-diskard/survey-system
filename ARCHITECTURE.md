# Architecture & Codebase Structure

## Overview

The survey system is a full-stack application composed of a React frontend, Node.js/Express backend, and PostgreSQL database. The unified deployment combines both frontend and backend into a single Docker container for simplified infrastructure.

## Folder Structure

```
survey-system-unified/
├── client/                    # React frontend application
│   ├── public/               # Static assets (HTML, manifest, robots.txt)
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page-level components (routes)
│   │   ├── routes/           # Route definitions
│   │   ├── config/           # Configuration files
│   │   ├── svg/              # SVG assets
│   │   ├── App.js            # Root App component
│   │   ├── index.js          # Entry point
│   │   └── ThemeContext.js   # Theme/state management
│   ├── package.json          # Frontend dependencies
│   └── nginx.conf            # Nginx config (production serving)
│
├── server/                    # Node.js backend application
│   ├── __tests__/            # Jest test suites
│   │   ├── routes/           # Route tests
│   │   └── services/         # Service tests
│   ├── config/               # Configuration management
│   │   └── db.js             # Database connection
│   ├── controllers/          # Request handlers
│   │   ├── authController.js # Authentication logic
│   │   ├── surveyController.js # Survey operations
│   │   ├── clientController.js # Client-facing endpoints
│   │   └── adminController.js  # Admin endpoints
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic layer
│   ├── middleware/           # Express middleware (auth, logging, etc.)
│   ├── utils/                # Utility functions
│   ├── localization_queries/ # Database queries by feature
│   ├── metrics/              # Analytics & metrics
│   ├── certs/                # SSL certificates (for self-signed dev)
│   ├── server.js             # Express app entry point
│   └── package.json          # Backend dependencies
│
├── context/                   # Database templates
│   └── db_template_survey.sql # PostgreSQL schema
│
├── scripts/                   # Utility scripts
│   ├── setup-dev.sh          # Linux/macOS setup
│   └── setup-dev.bat         # Windows setup
│
├── Dockerfile                # Single unified container
├── docker-compose.yml        # Development multi-container setup
├── docker-compose.prod.yml   # Production multi-container setup
├── .env.example              # Environment variable template
└── package.json              # Root scripts for managing both
```

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Styling**: CSS-in-JS (styled-components or plain CSS)
- **Routing**: React Router v6
- **Build Tool**: Create React App
- **Testing**: Jest + React Testing Library (configured but minimal tests)
- **HTTP Client**: Fetch API
- **UI Components**: Material-UI or custom components

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 12+
- **ORM**: Raw SQL queries (via `pg` driver)
- **Testing**: Jest
- **Authentication**: Session-based (express-session)
- **Logging**: Console (can be enhanced)

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev & production)
- **CI/CD**: GitHub Actions (to be configured)

## Data Flow

### Survey Submission Flow
1. **Frontend**: User fills survey form (components/SurveyForm or similar)
2. **Frontend**: Form validated locally
3. **API POST**: `POST /api/surveys/submit` with form data
4. **Backend**: Route → Controller → Service
5. **Service**: Validate data, prepare for database
6. **Database**: Insert into `responses` table via `db_template_survey.sql` schema
7. **Response**: Return success or error to frontend
8. **Frontend**: Display confirmation message

### Admin Dashboard Flow
1. **Frontend**: Admin logs in via login form
2. **API POST**: `POST /api/auth/login` with credentials
3. **Backend**: authController validates user against database
4. **Session**: Express-session creates authenticated session
5. **Cookie**: Session cookie sent to client
6. **Frontend**: Redirect to admin dashboard
7. **API GET**: Dashboard fetches analytics: `GET /api/analytics/dashboard`
8. **Backend**: Controllers aggregate data from multiple tables
9. **Response**: JSON data with survey counts, response trends, etc.
10. **Frontend**: Admin pages render charts/tables using data

## Key Components

### Frontend Components (client/src/components/)
Important components to understand:
- **SurveyForm**: Main survey input form
- **AdminDashboard**: Admin analytics view
- **Sidebar**: Admin navigation (recently improved)
- **Login**: Authentication form

### Backend Controllers (server/controllers/)
Main request handlers:
- **authController**: Login, logout, session management
- **surveyController**: CRUD operations for surveys (templates, metadata)
- **clientController**: Public-facing endpoints (survey submission, retrieval)
- **adminController**: Admin operations (analytics, user management)

### Backend Services (server/services/)
Business logic:
- Data validation and processing
- Database query preparation
- Analytics calculations
- Error handling

### Database Tables (MARCH_2025_TEMPLATEBACKUP.sql)
**Template Database Location:** The template database schema is defined in `MARCH_2025_TEMPLATEBACKUP.sql` (root directory backup file)

Core tables:
- `surveys`: Survey templates/definitions
- `responses`: Individual survey responses (responses submitted by users)
- `users`: Admin and client accounts
- `sections`: Survey question sections
- `questions`: Individual questions
- `localization`: Translations
- And related tables for analytics/metrics

For development reference, the context directory also contains `context/db_template_survey.sql`

## API Endpoints

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/status         # Check auth status
```

### Surveys (Public)
```
GET    /api/surveys/:id         # Get survey template
POST   /api/surveys/submit      # Submit survey response
```

### Analytics (Admin)
```
GET    /api/analytics/dashboard # Dashboard data
GET    /api/analytics/trends    # Response trends
GET    /api/analytics/reports   # Detailed reports
```

### Admin Operations
```
GET    /api/admin/surveys       # List survey templates
POST   /api/admin/surveys       # Create new survey
PUT    /api/admin/surveys/:id   # Update survey
DELETE /api/admin/surveys/:id   # Delete survey
```

## State Management

### Frontend
- **React Context**: ThemeContext.js for global theme/state
- **Props**: Component-level prop passing
- **Local State**: `useState` hooks in components
- **No Redux**: Not currently implemented (consider for future scaling)

### Backend
- **Session State**: express-session stores user authentication
- **Database**: PostgreSQL as source of truth
- **Cache**: Not currently implemented (Redis optional for scaling)

## Authentication & Authorization

### Session-Based Auth
1. User submits login credentials
2. Backend validates against `users` table
3. Express-session creates session with user ID
4. Session stored in memory (session-memory) or database (if store configured)
5. Client receives session cookie
6. Subsequent requests include cookie → server validates user

### Middleware Chain
Order in Express app:
1. Body parser (JSON/URL-encoded)
2. Session middleware (auth)
3. Logging middleware
4. Custom auth middleware (checks if user logged in)
5. Route handlers

### Protected Routes
- Admin routes require authenticated session
- Public routes accept anonymous requests
- Authorization checks in controllers

## Database Schema

Key relationships (see `context/db_template_survey.sql`):

```
users (id, email, password_hash, role)
  ↓
surveys (id, title, description, created_by)
  ├─→ sections (id, survey_id, title, order)
  │   └─→ questions (id, section_id, text, type)
  │       └─→ question_options (id, question_id, text, value)
  │
  └─→ responses (id, survey_id, submitted_at)
      └─→ response_answers (id, response_id, question_id, answer_value)

localization (id, key, language, value)  -- Translations
metrics (id, survey_id, response_count, ...)  -- Analytics cache
```

## Environment Variables

See `.env.example` for complete list. Key variables:

**Database**
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

**Server**
- `NODE_ENV` (development/production)
- `PORT` (default 5000)

**Security**
- `SESSION_SECRET` (critical: generate new for each deployment)

**Optional APIs**
- `SENDGRID_API_KEY` (email)
- `HUGGING_FACE_API_KEY` (AI features)

## Development Workflow

### Local Development
1. Run both frontend and backend with `npm run dev`
2. Frontend hot-reloads on file changes
3. Backend requires manual restart on changes (or use `nodemon`)
4. Use browser DevTools for frontend debugging
5. Use CloudDebug/VS Code debugger for backend

### Testing
```bash
npm test  # Runs server tests (Jest)
```

### Building
```bash
npm run build  # Builds client and installs server
```

### Deployment
1. Build docker image: `docker build -t survey-system .`
2. Push to registry (Docker Hub, GCP, etc.)
3. Deploy to Cloud Run, App Platform, or self-hosted
4. See [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for details

## Performance Considerations

### Frontend
- Large forms may benefit from code-splitting (React.lazy)
- Consider pagination for admin dashboard tables
- Optimize images in public/ folder

### Backend
- Database queries should use indexes (check db_template_survey.sql)
- Consider query caching for analytics endpoints
- Implement rate limiting for public endpoints
- Use database connection pooling in production

### Database
- Regular vacuum/analyze maintenance
- Monitor slow queries (add EXPLAIN analysis)
- Archive old responses to separate table if storage grows

## Security Practices

### Current Implementation
- Session-based auth (cookies)
- Password hashing (assumed in authController)
- HTTPS support (Dockerfile serves via Nginx)
- CORS handling (verify in server/server.js)

### To Review
- SQL injection prevention (use prepared statements)
- XSS prevention (React auto-escapes, validate on server)
- CSRF protection (session cookies are HttpOnly)
- Input validation (check controllers)
- Rate limiting (not currently implemented)
- Logging (basic only; enhance for audit trail)

## Scaling Considerations

If the system grows:

1. **Database**: Split read replicas for analytics queries
2. **Cache**: Add Redis for session and query caching
3. **Frontend**: Code-split and lazy-load components
4. **Backend**: Load balance across multiple server instances
5. **API**: Consider API Gateway pattern
6. **Monitoring**: Add APM tool (New Relic, DataDog, etc.)
7. **Logging**: Centralize logs (ELK stack, Cloud Logging, etc.)

## Common Development Tasks

### Add a New Survey Field
1. Add column to `responses` table in `db_template_survey.sql`
2. Create UI input in `client/src/components/SurveyForm.jsx`
3. Add form validation
4. Update `POST /api/surveys/submit` handler in surveyController
5. Update admin analytics to display new metric

### Add a New Admin Page
1. Create component in `client/src/pages/`
2. Add route to `client/src/routes/` or Web/AdminRoutes.jsx
3. Create API endpoint(s) in `server/controllers/` and `server/routes/`
4. Add navigation link in Sidebar component
5. Test authentication and authorization

### Deploy to Production
1. Update version in package.json
2. Build and push Docker image
3. Update environment variables on hosting platform
4. Run database migrations (if schema changed)
5. Deploy container and verify
6. See [INFRASTRUCTURE.md](INFRASTRUCTURE.md) for platform-specific steps

## Related Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Setup & dev server
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [INFRASTRUCTURE.md](INFRASTRUCTURE.md) - GCP/DO deployment
- [HANDOFF.md](HANDOFF.md) - Known issues & incomplete work
- [README.md](survey-system-unified/README.md) - Feature overview
