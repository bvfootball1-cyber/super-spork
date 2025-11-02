/**
 * API Routes Plugin
 * Adds RESTful API endpoints to the Express app
 */

module.exports = {
  metadata: {
    name: 'api-routes',
    version: '1.0.0',
    description: 'RESTful API endpoints for haikus',
    author: 'Plugin System'
  },

  async init(app, pluginManager) {
    const haikus = require('../haikus.json');

    // GET /api/haikus - Get all haikus
    app.get('/api/haikus', (req, res) => {
      res.json({
        success: true,
        count: haikus.length,
        data: haikus
      });
    });

    // GET /api/haikus/random - Get random haiku (MUST be before :id route)
    app.get('/api/haikus/random', (req, res) => {
      const randomIndex = Math.floor(Math.random() * haikus.length);
      res.json({
        success: true,
        index: randomIndex,
        data: haikus[randomIndex]
      });
    });

    // GET /api/haikus/:id - Get specific haiku by index
    app.get('/api/haikus/:id', (req, res) => {
      const id = parseInt(req.params.id);

      if (isNaN(id) || id < 0 || id >= haikus.length) {
        return res.status(404).json({
          success: false,
          error: 'Haiku not found'
        });
      }

      res.json({
        success: true,
        data: haikus[id]
      });
    });

    // GET /api/health - Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    console.log('[API Routes Plugin] Registered API endpoints: /api/haikus, /api/haikus/:id, /api/haikus/random, /api/health');
  }
};
