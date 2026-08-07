
// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import clientRoutes from './routes/clientRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import logger from './middleware/logger.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { handleAnonymousUser } from './middleware/anonymousUserMiddleware.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import pool from './config/db.js';
import pgSession from 'connect-pg-simple';
import { logstream } from './controllers/adminController.js';
import { spamThrottle } from './middleware/spamthrottle.js';
import { authenticate, authorizeAdmin } from './middleware/authMiddleware.js';
import { env } from './config/env.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define client build path for static file serving
const clientBuildPath = path.join(__dirname, '../client/build');

const PgSession = pgSession(session);
const app = express();

// Middleware setup
app.use(express.json());

// Security headers must be registered before any route so they apply to every request
app.use(helmet());

// CORS setup - fail closed: only allow the configured frontend origin.
// In unified deployment the frontend is served from the same origin, so no
// cross-origin allowance is needed; defaulting to `true` would reflect any
// origin while credentials are enabled, defeating same-origin protection.
const corsOptions = {
  origin: env.FRONTEND_URL || false,
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Rate limiting must be registered before routes so it applies to every request
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 10000 // limit each IP per windowMs
});
app.use(limiter);

// Serve static files from the React app build directory in production
app.use(express.static(clientBuildPath));

app.use(cookieParser());
app.use(
  session({
    store: new PgSession({
      pool: pool, // Provide the pool object from the database connection
      tableName: 'anonymous_session', // Name of the table to store sessions (default is "session")
    }),
    secret: env.SESSION_SECRET, // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day
      secure: env.NODE_ENV === 'production', // HTTPS-only in production
      sameSite: 'lax',
    },
  })
);
app.use(handleAnonymousUser);
app.use(spamThrottle);

// Log stream must be authenticated (admin-only) and registered after session/auth
// setup — it broadcasts every application log line via SSE.
app.use('/api/log-stream', authenticate, authorizeAdmin, logstream);

// Serve static files from React build (in production)
if (env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));
  logger.info(`Serving static files from: ${clientBuildPath}`);
}

// Use client routes
app.use('/', clientRoutes);

// Use admin routes
app.use('/', adminRoutes);

//authentication routes
app.use(authRoutes);

// Health check endpoint for Docker and monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Catch-all handler: serve React app for all non-API routes
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error('Error serving React app:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Central error handler must be registered last so it catches errors thrown by
// every route above it (including auth routes).
app.use(errorHandler);

export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const PORT = env.PORT;
  app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`); // Log the actual port being used
      logger.info(`Serving static files from: ${clientBuildPath}`);
  });
}
