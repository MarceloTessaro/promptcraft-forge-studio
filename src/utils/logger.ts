
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
};

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private createLogEntry(
    level: string, 
    message: string, 
    context?: string, 
    data?: any
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  private log(level: string, message: string, context?: string, data?: any) {
    const logEntry = this.createLogEntry(level, message, context, data);
    
    // Console logging for development
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`, data || '');
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && level === 'error') {
      // Example: sendToLoggingService(logEntry);
    }

    return logEntry;
  }

  error(message: string, context?: string, data?: any) {
    return this.log(LOG_LEVELS.ERROR, message, context, data);
  }

  warn(message: string, context?: string, data?: any) {
    return this.log(LOG_LEVELS.WARN, message, context, data);
  }

  info(message: string, context?: string, data?: any) {
    return this.log(LOG_LEVELS.INFO, message, context, data);
  }

  debug(message: string, context?: string, data?: any) {
    if (this.isDevelopment) {
      return this.log(LOG_LEVELS.DEBUG, message, context, data);
    }
  }
}

export const logger = new Logger();
