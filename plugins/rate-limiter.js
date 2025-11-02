/**
 * Rate Limiter Plugin
 * Implements simple in-memory rate limiting for API endpoints
 */

module.exports = {
  metadata: {
    name: 'rate-limiter',
    version: '1.0.0',
    description: 'Rate limiting middleware to prevent API abuse',
    author: 'Plugin System'
  },

  // Configuration
  config: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // max requests per window
    message: 'Too many requests, please try again later.'
  },

  // Store for tracking requests
  requestCounts: new Map(),

  async init(app, pluginManager) {
    const self = this;

    // Cleanup old entries periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of self.requestCounts.entries()) {
        if (now - data.resetTime > self.config.windowMs) {
          self.requestCounts.delete(key);
        }
      }
    }, 60000); // Clean up every minute

    // Rate limiting middleware
    const rateLimitMiddleware = (req, res, next) => {
      // Only rate limit API endpoints
      if (!req.path.startsWith('/api/')) {
        return next();
      }

      const key = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      let requestData = self.requestCounts.get(key);

      if (!requestData || now - requestData.resetTime > self.config.windowMs) {
        // New window
        requestData = {
          count: 1,
          resetTime: now
        };
        self.requestCounts.set(key, requestData);
      } else {
        // Within window
        requestData.count++;
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', self.config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, self.config.maxRequests - requestData.count));
      res.setHeader('X-RateLimit-Reset', new Date(requestData.resetTime + self.config.windowMs).toISOString());

      if (requestData.count > self.config.maxRequests) {
        return res.status(429).json({
          success: false,
          error: self.config.message,
          retryAfter: Math.ceil((requestData.resetTime + self.config.windowMs - now) / 1000)
        });
      }

      next();
    };

    pluginManager.addMiddleware(rateLimitMiddleware);

    // Add endpoint to check rate limit status
    app.get('/api/rate-limit/status', (req, res) => {
      const key = req.ip || req.connection.remoteAddress;
      const requestData = self.requestCounts.get(key);

      if (!requestData) {
        return res.json({
          success: true,
          requests: 0,
          limit: self.config.maxRequests,
          remaining: self.config.maxRequests
        });
      }

      res.json({
        success: true,
        requests: requestData.count,
        limit: self.config.maxRequests,
        remaining: Math.max(0, self.config.maxRequests - requestData.count),
        resetTime: new Date(requestData.resetTime + self.config.windowMs).toISOString()
      });
    });

    console.log(`[Rate Limiter Plugin] Enabled: ${self.config.maxRequests} requests per ${self.config.windowMs / 1000}s`);
  }
};
