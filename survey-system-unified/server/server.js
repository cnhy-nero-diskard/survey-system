
// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define client build path for static file serving
const clientBuildPath = path.join(__dirname, '../client/build');

// Load environment variables first
dotenv.config();

// Check for required environment variables but make FRONTEND_URL optional for unified deployment
const requiredEnvVars = ['PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
}

const PgSession = pgSession(session);
const app = express();

// Middleware setup
app.use(express.json());

// CORS setup - allow both external frontend and unified deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // Allow all origins in unified mode or specific frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Serve static files from the React app build directory in production
app.use(express.static(clientBuildPath));

app.use(cookieParser());
app.use('/api/log-stream', logstream)
app.use(
  session({
    store: new PgSession({
      pool: pool, // Provide the pool object from the database connection
      tableName: 'anonymous_session', // Name of the table to store sessions (default is "session")
    }),
    secret: process.env.SESSION_SECRET, // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day
      secure: false // Set to true if using HTTPS
    },
  })
);
app.use(handleAnonymousUser);
app.use(spamThrottle);

// Serve static files from React build (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));
  logger.info(`Serving static files from: ${clientBuildPath}`);
}

// Use client routes
app.use('/', clientRoutes);

// Use admin routes
app.use('/', adminRoutes);
app.use(errorHandler);

//authentication routes
app.use(authRoutes);

// Security middleware (helmet) - configured after CORS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

//rate limiting
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 10000 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.get('/verify-cookie', (req, res) => {
  logger.info('Cookies: ', req.cookies);
  const token = req.cookies.token; // Access the cookie
  if (token) {
      logger.info('Token found in cookie:', token);
      res.send('Cookie is present and contains data.');
  } else {
      logger.info('No token found in cookie.');
      res.status(400).send('Cookie is missing or empty.');
  }
});

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

const PORT = process.env.PORT || 5000; // Use environment variable PORT or default to 5000
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`); // Log the actual port being used
    logger.info(`Serving static files from: ${clientBuildPath}`);
});