# Multi-stage Dockerfile for unified survey system
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY client/ ./

# Build the React app
RUN npm run build

# Stage 2: Setup backend and final image
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/client/build ./client/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S survey -u 1001

# Change ownership of the app directory
RUN chown -R survey:nodejs /app
USER survey

# Expose port
EXPOSE 5000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 5000, path: '/api/health' }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) process.exit(0); \
      else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Start the application
CMD ["npm", "start"]