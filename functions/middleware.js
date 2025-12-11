/**
 * Express Middleware Collection
 * Modern security and validation middleware for production deployment
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 */
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: 'Твърде много заявки. Моля, опитайте отново след няколко минути.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Твърде много заявки. Моля, опитайте отново след няколко минути.',
        retryAfter: res.getHeader('Retry-After')
      });
    }
  });
};

/**
 * Strict rate limiter for API endpoints
 */
const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute
});

/**
 * Lenient rate limiter for health checks
 */
const healthCheckLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 60
});

/**
 * Security headers middleware using helmet
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
});

/**
 * Input validation middleware
 * Sanitizes and validates user inputs
 */
const validateChatInput = (req, res, next) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Request body must contain data field'
      });
    }

    // Validate userId
    if (data.userId) {
      if (!validator.isAlphanumeric(data.userId, 'en-US', { ignore: '_-' })) {
        return res.status(400).json({
          error: 'invalid_user_id',
          message: 'Invalid userId format'
        });
      }
      // Sanitize
      data.userId = validator.escape(data.userId);
    }

    // Validate sessionId
    if (data.sessionId) {
      if (!validator.isAlphanumeric(data.sessionId, 'en-US', { ignore: '_-' })) {
        return res.status(400).json({
          error: 'invalid_session_id',
          message: 'Invalid sessionId format'
        });
      }
      data.sessionId = validator.escape(data.sessionId);
    }

    // Validate userParts
    if (!data.userParts || !Array.isArray(data.userParts)) {
      return res.status(400).json({
        error: 'missing_user_parts',
        message: 'userParts array is required'
      });
    }

    // Validate message length
    const messageText = data.userParts[0]?.text || '';
    if (messageText.length === 0) {
      return res.status(400).json({
        error: 'empty_message',
        message: 'Message cannot be empty'
      });
    }

    if (messageText.length > 5000) {
      return res.status(400).json({
        error: 'message_too_long',
        message: 'Message exceeds maximum length of 5000 characters'
      });
    }

    // Sanitize message text (but preserve Bulgarian characters)
    data.userParts[0].text = messageText.trim();

    // Validate chatHistory structure
    if (data.chatHistory && Array.isArray(data.chatHistory)) {
      data.chatHistory = data.chatHistory.slice(-20); // Keep last 20 messages only
    }

    req.body.data = data;
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      error: 'validation_error',
      message: 'Invalid request format'
    });
  }
};

/**
 * Error handling middleware
 * Catches and formats all errors
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  const statusCode = err.statusCode || 500;
  const message = isProduction && statusCode === 500 
    ? 'Вътрешна грешка. Моля, опитайте отново.'
    : err.message;

  res.status(statusCode).json({
    error: err.name || 'server_error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
};

/**
 * CORS configuration for production
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://dpengineering.site',
      'https://www.dpengineering.site',
      'http://localhost:3000', // Development
      'http://127.0.0.1:3000'
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * API key validation middleware
 */
const validateApiKey = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
    console.error('⚠️  GEMINI_API_KEY not configured!');
    return res.status(500).json({
      error: 'configuration_error',
      message: 'API configuration error'
    });
  }
  next();
};

module.exports = {
  apiLimiter,
  healthCheckLimiter,
  securityHeaders,
  validateChatInput,
  errorHandler,
  requestLogger,
  corsOptions,
  validateApiKey,
  createRateLimiter
};
