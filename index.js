const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const PluginManager = require('./lib/PluginManager');

const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;

// Initialize plugin manager
const pluginManager = new PluginManager();

// Make plugin manager available to all routes
app.locals.pluginManager = pluginManager;

// Setup Express
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

// Bootstrap function to initialize the app with plugins
async function bootstrap() {
  try {
    // Load plugins from the plugins directory
    const pluginsDir = path.join(__dirname, 'plugins');
    await pluginManager.loadFromDirectory(pluginsDir);

    // Initialize all plugins
    await pluginManager.init(app);

    // Apply all plugin middleware
    const middleware = pluginManager.getMiddleware();
    middleware.forEach(mw => app.use(mw));

    // Main route with plugin hooks
    app.get('/', async (req, res) => {
      try {
        // Run haikus through transformation hooks
        let transformedHaikus = await pluginManager.runHook('haikus:render', haikus);

        res.render('index', { haikus: transformedHaikus });
      } catch (error) {
        console.error('Error rendering haikus:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Plugin management endpoint
    app.get('/api/plugins', (req, res) => {
      res.json({
        success: true,
        data: pluginManager.list()
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error'
      });
    });

    // Start server
    const server = app.listen(port, () => {
      console.log(`\n🚀 Server started on port ${port}`);
      console.log(`📦 Loaded ${pluginManager.list().length} plugins`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  - http://localhost:${port}/`);
      console.log(`  - http://localhost:${port}/api/haikus`);
      console.log(`  - http://localhost:${port}/api/plugins`);
      console.log(`  - http://localhost:${port}/api/analytics`);
      console.log(`  - http://localhost:${port}/api/health\n`);

      // Trigger app start hook
      pluginManager.runHook('app:start', { port, server });
    });

    return server;
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();