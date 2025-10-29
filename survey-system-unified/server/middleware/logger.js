import winston from 'winston';
import { EventEmitter } from 'events';

// Create an event emitter for real-time logging
export const logEmitter = new EventEmitter();

// Define custom levels and colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    database: 4, // Custom log level
    admin: 5,
    toclient: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    database: 'cyan bold', 
    admin: 'magenta',
    toclient: 'yellow'
  },
};

// Add custom colors to Winston

/**
 * Creates a Winston logger instance with custom levels and colors.
 */
const logger = winston.createLogger({
  level: '',
  levels: customLevels.levels, // Use custom levels
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize({ all: true }), // Colorize the entire log message
    winston.format.printf(({ timestamp, level, message }) => {
  winston.addColors(customLevels.colors);
    const logMessage = `${timestamp} [${level}]: ${message}`;
      // Emit the log message to any listeners
      logEmitter.emit('log', logMessage);
      return logMessage;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});


export default logger;