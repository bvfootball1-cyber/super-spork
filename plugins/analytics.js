/**
 * Analytics Plugin
 * Tracks request statistics and provides analytics endpoint
 */

module.exports = {
  metadata: {
    name: 'analytics',
    version: '1.0.0',
    description: 'Request analytics and statistics tracking',
    author: 'Plugin System'
  },

  stats: {
    requests: 0,
    routes: {},
    startTime: Date.now()
  },

  async init(app, pluginManager) {
    const self = this;

    // Analytics middleware
    const analyticsMiddleware = (req, res, next) => {
      self.stats.requests++;

      const route = req.path;
      if (!self.stats.routes[route]) {
        self.stats.routes[route] = {
          count: 0,
          methods: {}
        };
      }

      self.stats.routes[route].count++;

      const method = req.method;
      if (!self.stats.routes[route].methods[method]) {
        self.stats.routes[route].methods[method] = 0;
      }
      self.stats.routes[route].methods[method]++;

      next();
    };

    pluginManager.addMiddleware(analyticsMiddleware);

    // Analytics API endpoint
    app.get('/api/analytics', (req, res) => {
      const uptime = Date.now() - self.stats.startTime;
      const uptimeSeconds = Math.floor(uptime / 1000);

      res.json({
        success: true,
        data: {
          totalRequests: self.stats.requests,
          uptime: {
            milliseconds: uptime,
            seconds: uptimeSeconds,
            minutes: Math.floor(uptimeSeconds / 60),
            hours: Math.floor(uptimeSeconds / 3600)
          },
          routes: self.stats.routes,
          requestsPerMinute: self.stats.requests / (uptimeSeconds / 60) || 0
        }
      });
    });

    console.log('[Analytics Plugin] Tracking enabled, stats available at /api/analytics');
  }
};
