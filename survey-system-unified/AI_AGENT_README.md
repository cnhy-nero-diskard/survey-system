# 🤖 AI Agent Guidelines for Survey System Codebase

**⚠️ CRITICAL: READ THIS BEFORE MAKING ANY CHANGES TO THE CODEBASE ⚠️**

This document provides essential context for AI agents working on this survey system. This codebase was rapidly developed under tight MVP deadlines, resulting in technical debt and architectural shortcuts that must be carefully navigated.

## 📋 Project Overview

### System Type
- **Tourism Survey Platform** - Collects visitor feedback and analytics
- **Unified Full-Stack Application** - React frontend + Node.js backend in single deployment
- **PostgreSQL Database** - Complex relational schema with localization support
- **Production MVP** - Currently serving real users with live data

### Architecture
```
survey-system-unified/
├── client/          # React frontend (CRA-based)
├── server/          # Node.js/Express backend
├── scripts/         # Setup utilities
└── Dockerfile       # Unified container deployment
```

## 🚨 Critical Safety Guidelines

### 1. Database Operations
**⚠️ NEVER ALTER DATABASE SCHEMA WITHOUT EXPLICIT APPROVAL**
- The system uses complex PostgreSQL schemas with foreign key relationships
- Production data exists - schema changes could cause data loss
- Migrations must be carefully planned and tested
- Always backup before schema modifications

### 2. Breaking Changes Prevention
**Before making ANY change, verify:**
- [ ] Frontend-backend API contracts remain intact
- [ ] Database queries still work with existing schema
- [ ] Environment variable dependencies are maintained
- [ ] Docker build process continues to work
- [ ] Existing user sessions won't be invalidated

### 3. MVP Technical Debt Areas (Handle with Care)
- **Mixed authentication patterns** - Session-based + JWT tokens coexist
- **Inconsistent error handling** - Some routes lack proper error boundaries
- **Hardcoded values** - Config scattered across files instead of centralized
- **Missing input validation** - Some endpoints lack proper sanitization
- **Deprecated dependencies** - Some packages may have security vulnerabilities
- **Performance bottlenecks** - N+1 queries and missing indexes exist

## 🏗️ System Architecture Details

### Frontend (React)
- **Framework**: Create React App (CRA) - avoid ejecting
- **UI Libraries**: Material-UI, Chakra UI (mixed usage - be consistent)
- **State Management**: Mixed patterns (useState, context, props drilling)
- **Routing**: React Router v6
- **API Communication**: Axios with custom config

**Key Frontend Files:**
- `client/src/config/apiConfig.js` - API endpoint configuration
- `client/src/ThemeContext.js` - Global theme management
- `client/src/components/` - Reusable UI components
- `client/src/pages/` - Page-level components

### Backend (Node.js/Express)
- **Runtime**: Node.js 18+ with ES modules
- **Framework**: Express.js with middleware stack
- **Database**: PostgreSQL with pg driver
- **Authentication**: Express sessions + JWT hybrid
- **Logging**: Winston for structured logging

**Key Backend Files:**
- `server/server.js` - Main application entry point
- `server/config/db.js` - Database connection configuration
- `server/routes/` - API route definitions
- `server/services/` - Business logic layer
- `server/middleware/` - Express middleware (auth, CORS, etc.)

### Database Schema
**Main Tables:**
- `survey_responses` - User survey data
- `anonymous_users` - Session management
- `localization00` - Multi-language content
- `establishments` - Tourism locations
- `tourismattractions` - Tourist destinations
- `sentiment_analysis` - AI-generated insights

## 🔧 Development Patterns

### Environment Configuration
```bash
# Development
NODE_ENV=development
REACT_APP_API_HOST=http://localhost:5000

# Production (Unified)
NODE_ENV=production
# API_HOST not needed - uses relative paths
```

### API Endpoint Patterns
```javascript
// Client-side API calls
import { getApiUrl } from '../config/apiConfig';

// Automatically handles dev vs prod URLs
const response = await axios.get(getApiUrl('/api/admin/data'));
```

### Database Query Patterns
```javascript
// Service layer pattern
export const fetchDataService = async (filters = {}) => {
  try {
    const query = `SELECT * FROM table WHERE condition = $1`;
    const result = await pool.query(query, [filters.value]);
    return result.rows;
  } catch (err) {
    logger.error({ error: err.message });
    throw err;
  }
};
```

## ⚠️ Known Issues & Workarounds

### 1. Mixed UI Libraries
- **Problem**: Both Material-UI and Chakra UI are used
- **Workaround**: Prefer Material-UI for new components
- **Don't**: Add more UI libraries

### 2. Authentication Complexity
- **Problem**: Session + JWT hybrid system
- **Workaround**: Follow existing patterns in `authController.js`
- **Don't**: Refactor auth system without migration plan

### 3. Localization Implementation
- **Problem**: Hardcoded language keys scattered across components
- **Workaround**: Use existing `localization00` table patterns
- **Don't**: Create new localization systems

### 4. Error Handling Gaps
- **Problem**: Inconsistent error responses
- **Workaround**: Follow `errorHandler.js` middleware patterns
- **Don't**: Remove existing error handling without replacement

## 🚀 Safe Development Practices

### Making Frontend Changes
1. **Test API compatibility** - Ensure backend endpoints still work
2. **Check responsive design** - Mobile users are primary audience
3. **Verify language switching** - Multi-language support is critical
4. **Test offline behavior** - Handle network failures gracefully

### Making Backend Changes
1. **Database queries** - Always use parameterized queries (prevent SQL injection)
2. **API versioning** - Don't break existing endpoints
3. **Authentication** - Maintain session security
4. **Logging** - Use winston logger for consistency

### Environment Variables
**Required for functionality:**
```env
# Database (Critical)
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# Security (Critical)
SESSION_SECRET, JWT_SECRET

# Optional but recommended
SENDGRID_API_KEY, HF_TOKEN_1, HF_TOKEN_2
```

## 🧪 Testing Strategy

### Before Deploying Changes
1. **Unit Tests**: Run `npm test` in server directory
2. **Integration Tests**: Test full user survey flow
3. **Database Tests**: Verify all CRUD operations work
4. **Cross-browser Tests**: Test in Chrome, Firefox, Safari
5. **Mobile Tests**: Verify responsive design

### Manual Testing Checklist
- [ ] User can complete a survey end-to-end
- [ ] Admin dashboard loads without errors
- [ ] Language switching works correctly
- [ ] Data exports function properly
- [ ] Authentication flows work as expected

## 📊 Performance Considerations

### Known Bottlenecks
- Large dataset queries in admin dashboard
- Unoptimized chart rendering
- Missing database indexes on frequently queried columns
- Synchronous file processing operations

### Optimization Guidelines
- Use pagination for large datasets
- Implement database query optimization
- Add proper indexes before performance fixes
- Consider caching for frequently accessed data

## 🔐 Security Considerations

### Current Security Measures
- CORS configuration for cross-origin requests
- Session management with secure cookies
- SQL injection prevention via parameterized queries
- Rate limiting on API endpoints
- HTTPS enforcement in production

### Security Gaps to Address Carefully
- Input validation missing on some endpoints
- No API key rotation mechanism
- Limited audit logging for admin actions
- Potential XSS vulnerabilities in user-generated content

## 🚫 What NOT to Do

### Absolute Don'ts
1. **Never** modify database schema without backup and rollback plan
2. **Never** remove authentication middleware from protected routes
3. **Never** hardcode credentials or sensitive data
4. **Never** break existing API contracts
5. **Never** remove CORS configurations
6. **Never** disable security middleware

### Risky Changes (Require Extra Caution)
- Modifying session management
- Changing database connection configuration
- Updating authentication flows
- Refactoring core business logic
- Changing build/deployment processes

## 📞 Emergency Procedures

### If Something Breaks
1. **Check logs**: `docker logs <container_id>` or application logs
2. **Database connectivity**: Verify connection string and credentials
3. **Rollback strategy**: Revert to last known working state
4. **Health checks**: Use `/api/health` endpoint for status

### Quick Fixes
```bash
# Restart application
docker-compose restart survey-app

# Check database connectivity
node -e "import('./server/config/db.js').then(pool => pool.query('SELECT NOW()'))"

# Clear sessions (if auth issues)
# Truncate sessions table - USE WITH CAUTION
```

## 🎯 Improvement Priorities

### Technical Debt to Address (In Order)
1. **Standardize error handling** across all routes
2. **Consolidate UI library usage** (prefer Material-UI)
3. **Add comprehensive input validation**
4. **Implement proper logging** for all user actions
5. **Database query optimization** and indexing
6. **Security audit** and vulnerability fixes

### Safe Refactoring Areas
- Component extraction and reusability
- Utility function creation
- Code documentation improvements
- Test coverage expansion
- Performance optimizations (non-breaking)

---

## 📝 Final Notes for AI Agents

This codebase is **production-critical** with **real users** and **live data**. Every change should be:

- **Incremental** - Small, testable changes
- **Backward compatible** - Don't break existing functionality
- **Well-tested** - Verify impact before deployment
- **Documented** - Update relevant documentation
- **Reversible** - Have a rollback plan

**Remember**: The goal is to improve the system while maintaining 100% uptime and data integrity. When in doubt, ask for clarification or choose the safer approach.

**Last Updated**: October 31, 2025
**Version**: 1.0.0
**Maintainer**: Development Team