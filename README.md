# Survey System - Tourism Survey Platform

please note: repo is in active WIP

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive, multilingual tourism survey platform designed for collecting, analyzing, and visualizing visitor feedback across multiple touchpoints. The system supports multiple deployment architectures and includes advanced features like AI-powered sentiment analysis and real-time analytics.

## 🏞️ Overview

This repository contains a complete tourism survey system built for collecting visitor feedback across various tourism touchpoints including accommodations, attractions, transportation, and general experiences. The platform was originally designed for tourism boards and research institutions to gather comprehensive visitor data.

### Key Features

- **🌍 Multilingual Support**: 8+ languages (English, Spanish, French, Korean, Chinese, Japanese, Russian, Hindi)
- **📱 Progressive Web App**: Mobile-optimized responsive design
- **🤖 AI Integration**: Sentiment analysis and topic modeling using Hugging Face
- **📊 Real-time Analytics**: Live dashboards with charts and visualizations
- **🏢 Multi-touchpoint**: Support for attractions, establishments, transportation, and more
- **🔐 Secure Authentication**: Role-based access control for administrators
- **📈 Advanced Reporting**: Exportable data in multiple formats
- **🌐 Flexible Deployment**: Both unified and separate deployment options

## 🏗️ Architecture

This repository contains three different deployment approaches:

### Current Repository Structure
```
survey-system/
├── surveymockup1/              # Original React Frontend
├── surveymockup1_backend/      # Original Node.js Backend  
├── survey-system-unified/      # NEW: Unified Deployment (Recommended)
└── test.txt                   # Repository marker file
```

### Deployment Options

| Approach | Use Case | Cost | Complexity | Status |
|----------|----------|------|------------|---------|
| **Unified** | Production, cost optimization | Low | Simple | ✅ Recommended |
| **Separate** | Development, microservices | High | Medium | 🔧 Legacy |

## 🚀 Quick Start

### Option 1: Unified Deployment (Recommended)

For the most cost-effective and streamlined deployment:

```bash
# Navigate to unified version
cd survey-system-unified

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies and start
npm run setup:all
npm run dev          # Development mode
# or
npm run build        # Production build
npm start           # Production server
```

**Access**: `http://localhost:5000` (both frontend and API)

### Option 2: Separate Deployments

For development or microservices architecture:

```bash
# Backend setup
cd surveymockup1_backend
npm install
npm start           # Runs on :5000

# Frontend setup (new terminal)
cd surveymockup1
npm install
npm start           # Runs on :3000
```

**Access**: 
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📊 System Components

### Frontend (`surveymockup1/` or `survey-system-unified/client/`)

**Technology Stack:**
- React 18+ with functional components and hooks
- Material-UI for design system
- Styled Components for custom styling
- Axios for API communication
- React Router for navigation
- Chart.js and Plotly.js for visualizations

**Key Features:**
- Multi-step survey forms with conditional logic
- Real-time data validation and submission
- Responsive design for mobile and desktop
- Language switching with persistent preferences
- Progress tracking and local storage backup
- Interactive data visualizations

**Main Survey Modules:**
- Personal Profile Collection
- Residence and Demographics
- Transportation Preferences
- Accommodation Feedback
- Attraction Ratings
- Expense Tracking
- Package Tour Evaluation
- Open-ended Feedback

### Backend (`surveymockup1_backend/` or `survey-system-unified/server/`)

**Technology Stack:**
- Node.js with Express.js framework
- PostgreSQL database with connection pooling
- JWT authentication and session management
- Winston logging system
- Helmet for security headers
- Rate limiting and spam protection

**API Endpoints:**
```
Survey Operations:
├── POST /api/survey/submit        # Submit survey responses
├── GET  /api/survey/progress      # Get completion status
├── GET  /api/municipalities       # Location data
├── GET  /api/languageselect      # Available languages
└── GET  /api/texts               # Localized content

Admin Operations:
├── GET  /api/admin/fetch         # Tourism attractions
├── POST /api/admin/establishment # Manage establishments
├── GET  /api/admin/survey-responses # Response analytics
├── POST /api/analyzesentiment    # AI sentiment analysis
├── POST /api/analyzetopics       # AI topic modeling
└── GET  /api/admin/getEntityMetrics # Performance metrics

Authentication:
├── POST /api/auth/login          # Admin login
├── GET  /api/auth/check          # Verify session
└── POST /api/auth/logout         # End session
```

### Database Schema

**Core Tables:**
- `anonymous_users` - Survey respondent tracking
- `survey_responses` - Individual question responses
- `localization00` - Multilingual content
- `establishments` - Accommodation and service providers
- `tourism_attractions` - Points of interest
- `sentiment_analysis` - AI analysis results
- `admin_users` - System administrators

## 🔧 Development Guide

### Prerequisites

- **Node.js** 18+ and npm 8+
- **PostgreSQL** 13+ database
- **Git** for version control
- **Docker** (optional, for containerized development)

### Environment Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE survey_db;
   CREATE USER survey_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE survey_db TO survey_user;
   ```

2. **Environment Variables**
   ```bash
   # Required for all deployments
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=survey_db
   DB_USER=survey_user
   DB_PASSWORD=your_password
   SESSION_SECRET=your_secure_session_key
   PORT=5000
   
   # Optional: External API integrations
   SENDGRID_API_KEY=your_sendgrid_key
   HF_TOKEN_1=hugging_face_token_1
   HF_TOKEN_2=hugging_face_token_2
   ```

3. **Database Schema**
   ```bash
   # Navigate to backend directory
   cd surveymockup1_backend
   
   # Run schema creation scripts
   psql -U survey_user -d survey_db -f localization_queries/schemacreation/
   ```

### Development Workflow

**Unified Development:**
```bash
cd survey-system-unified
npm run dev                    # Start both frontend and backend
npm run dev:client            # Frontend only (React dev server)
npm run dev:server            # Backend only (Node.js with nodemon)
npm run test                  # Run test suites
```

**Separate Development:**
```bash
# Terminal 1: Backend
cd surveymockup1_backend
npm run dev                   # Start with nodemon

# Terminal 2: Frontend  
cd surveymockup1
npm start                     # Start React dev server
```

## 🌐 Deployment

### Production Deployment (Unified)

**Docker Deployment:**
```bash
cd survey-system-unified

# Build and run
docker build -t survey-system .
docker run -p 5000:5000 --env-file .env survey-system

# Or with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

**Cloud Platforms:**

<details>
<summary>Google Cloud Run</summary>

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/survey-system

# Deploy
gcloud run deploy survey-system \
  --image gcr.io/YOUR_PROJECT/survey-system \
  --platform managed \
  --port 5000 \
  --set-env-vars NODE_ENV=production,DB_HOST=your_db_host
```
</details>

<details>
<summary>Railway</summary>

```bash
# Connect repository to Railway
# Add environment variables in Railway dashboard
# Deploy automatically on git push
```
</details>

<details>
<summary>Heroku</summary>

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```
</details>

### Separate Deployments

For microservices or development environments:

**Frontend (Netlify/Vercel):**
```bash
cd surveymockup1
npm run build
# Deploy build/ directory
```

**Backend (Railway/Heroku):**
```bash
cd surveymockup1_backend
git subtree push --prefix=surveymockup1_backend heroku main
```

## 🔐 Security Features

- **Authentication**: JWT-based admin authentication
- **Session Management**: Secure session cookies with CSRF protection
- **Rate Limiting**: Configurable request rate limits
- **Data Validation**: Input sanitization and validation
- **CORS**: Configurable cross-origin resource sharing
- **Headers**: Security headers via Helmet.js
- **Database**: Parameterized queries to prevent SQL injection
- **Encryption**: Environment-based secrets management

## 📊 Analytics & AI Features

### Survey Analytics
- Real-time response tracking
- Geographic distribution analysis
- Demographic breakdowns
- Satisfaction score calculations
- Trend analysis over time

### AI-Powered Insights
- **Sentiment Analysis**: Automatic classification of open-ended responses
- **Topic Modeling**: Identification of key themes in feedback
- **Relevance Classification**: Filtering of relevant vs irrelevant responses
- **Custom Labeling**: AI-generated labels for response categories

### Visualization Tools
- Interactive charts (Chart.js, Plotly.js)
- Heat maps for geographic data
- Time series analysis
- Export capabilities (CSV, PDF, images)

## 🌍 Localization

The system supports comprehensive localization:

**Supported Languages:**
- English (en) - Primary
- Spanish (es)
- French (fr) 
- Korean (ko)
- Chinese Simplified (zh)
- Japanese (ja)
- Russian (ru)
- Hindi (hi)

**Localization Features:**
- Dynamic language switching
- Currency conversion for expense tracking
- Cultural adaptations for survey questions
- RTL language support preparation
- Admin interface for content management

## 🧪 Testing

### Test Coverage

**Frontend Tests:**
```bash
cd surveymockup1 # or survey-system-unified/client
npm test                      # Jest + React Testing Library
npm run test:coverage         # Coverage reports
```

**Backend Tests:**
```bash
cd surveymockup1_backend # or survey-system-unified/server  
npm test                      # Jest + Supertest
npm run test:integration      # Integration tests
```

**End-to-End Tests:**
```bash
cd survey-system-unified
npm run test:e2e             # Full user journey tests
```

### Performance Testing

**Load Testing:**
```bash
# Install artillery
npm install -g artillery

# Run load tests
artillery run tests/load-test.yml
```

**Database Performance:**
```sql
-- Monitor slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC;
```

## 📝 API Documentation

### Survey Submission Flow

```javascript
// 1. Initialize anonymous user
POST /api/init-anonymous-user
// Returns: { user_id, session_token }

// 2. Submit survey responses
POST /api/survey/submit
{
  "surveyResponses": [
    {
      "anonymous_user_id": "uuid",
      "surveyquestion_ref": "TPENT",
      "response_value": "Hotel XYZ",
      "touchpoint": "accommodation"
    }
  ]
}

// 3. Track progress
GET /api/survey/progress?user_id=uuid
// Returns: { completed_steps: [], current_step: "accommodation" }
```

### Admin API Examples

```javascript
// Get survey analytics
GET /api/admin/getEntityMetrics
// Returns: Aggregated metrics by entity and touchpoint

// Sentiment analysis
POST /api/analyzesentiment
{
  "text": "The hotel was amazing and staff was very friendly",
  "tokenLabel": "sentiment-analysis-model"
}
// Returns: { sentiment: "positive", confidence: 0.95 }

// Fetch establishments
GET /api/admin/fetch
// Returns: All establishments with translations
```

## 🤝 Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/survey-system.git
   cd survey-system
   ```

2. **Choose Development Approach**
   ```bash
   # Unified development (recommended)
   cd survey-system-unified
   npm run setup:all
   
   # Separate development
   # Set up both surveymockup1 and surveymockup1_backend
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: StandardJS or ESLint
- **Database**: SQL formatting standards
- **Commits**: Conventional commit messages

### Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update version numbers if needed
5. Create detailed PR description

## 📚 Documentation

### Additional Resources

- **[API Reference](docs/api.md)** - Complete API documentation
- **[Database Schema](docs/database.md)** - Table structures and relationships
- **[Deployment Guide](docs/deployment.md)** - Platform-specific deployment instructions
- **[Localization Guide](docs/localization.md)** - Adding new languages and content
- **[Analytics Guide](docs/analytics.md)** - Using the reporting features

### Architecture Decisions

- **[ADR-001](docs/adr/001-unified-deployment.md)** - Unified vs Separate Deployment
- **[ADR-002](docs/adr/002-database-design.md)** - Database Schema Design
- **[ADR-003](docs/adr/003-authentication.md)** - Authentication Strategy

## 🐛 Troubleshooting

### Common Issues

<details>
<summary>Database Connection Issues</summary>

```bash
# Check PostgreSQL status
systemctl status postgresql

# Test connection
psql -U survey_user -d survey_db -c "SELECT NOW();"

# Check environment variables
echo $DB_HOST $DB_USER $DB_NAME
```
</details>

<details>
<summary>Frontend Build Issues</summary>

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for memory issues
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```
</details>

<details>
<summary>API Connection Issues</summary>

```bash
# Check CORS settings
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:5000/api/health

# Verify API endpoints
curl http://localhost:5000/api/health
```
</details>

## 📊 Performance Metrics

### Expected Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Page Load Time | < 3s | Initial app load |
| API Response Time | < 500ms | Most endpoints |
| Database Queries | < 100ms | Simple selects |
| Concurrent Users | 1000+ | With proper scaling |
| Uptime | 99.9% | Production target |

### Monitoring

- **Application**: Health check endpoints
- **Database**: Connection pooling and query monitoring  
- **Logs**: Structured logging with Winston
- **Metrics**: Custom Prometheus metrics
- **Alerts**: Configurable error thresholds

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tourism Research Team** - Original requirements and testing
- **Open Source Libraries** - React, Express, PostgreSQL, and many others
- **AI/ML Services** - Hugging Face for sentiment analysis capabilities
- **Community Contributors** - Bug reports, feature requests, and improvements

## 📞 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/cnhy-nero-diskard/survey-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cnhy-nero-diskard/survey-system/discussions)
- **Documentation**: Check the `/docs` directory for detailed guides

### Reporting Bugs

When reporting bugs, please include:
- Environment details (OS, Node.js version, database version)
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs or error messages
- Screenshots if applicable

### Feature Requests

Feature requests are welcome! Please:
- Search existing issues first
- Provide clear use cases
- Consider implementation complexity
- Discuss potential breaking changes

---

**Built with ❤️ for the tourism industry**

*Last updated: October 29, 2025*