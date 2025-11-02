/**
 * Logger Plugin
 * Adds request logging middleware to the Express app
 */

module.exports = {
  metadata: {
    name: 'logger',
    version: '1.0.0',
    description: 'HTTP request logging middleware',
    author: 'Plugin System'
  },

  async init(app, pluginManager) {
    // Create logger middleware
    const loggerMiddleware = (req, res, next) => {
      const start = Date.now();
      const timestamp = new Date().toISOString();

      // Log when response finishes
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
      });

      next();
    };

    // Register middleware through plugin manager
    pluginManager.addMiddleware(loggerMiddleware);

    // Register hook for app startup
    pluginManager.registerHook('app:start', (data) => {
      console.log('[Logger Plugin] Application started, logging enabled');
      return data;
    });
  }
};
