/**
 * CORS Plugin
 * Adds Cross-Origin Resource Sharing headers
 */

module.exports = {
  metadata: {
    name: 'cors',
    version: '1.0.0',
    description: 'CORS middleware for API endpoints',
    author: 'Plugin System'
  },

  async init(app, pluginManager) {
    const corsMiddleware = (req, res, next) => {
      // Allow requests from any origin (configure as needed)
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }

      next();
    };

    pluginManager.addMiddleware(corsMiddleware);

    console.log('[CORS Plugin] CORS headers enabled for all routes');
  }
};
