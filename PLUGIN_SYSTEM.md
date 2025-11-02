# Plugin System Documentation

## Overview

This application implements a robust plugin architecture that allows developers to extend functionality without modifying the core application code. The plugin system is inspired by modern middleware patterns and provides hooks, middleware registration, and lifecycle management.

## Architecture

### Core Components

1. **PluginManager** (`lib/PluginManager.js`)
   - Central registry for all plugins
   - Handles plugin initialization and lifecycle
   - Manages hooks and middleware
   - Auto-loads plugins from directory

2. **Plugins Directory** (`plugins/`)
   - Contains individual plugin modules
   - Each plugin is a standalone JavaScript file
   - Plugins are auto-discovered and loaded on startup

3. **Hook System**
   - Allows plugins to intercept and transform data
   - Supports asynchronous operations
   - Enables plugin communication and coordination

## Creating a Plugin

### Basic Plugin Structure

Every plugin must export an object with the following structure:

```javascript
module.exports = {
  // Metadata (optional but recommended)
  metadata: {
    name: 'plugin-name',
    version: '1.0.0',
    description: 'What this plugin does',
    author: 'Your Name'
  },

  // Required: Initialization function
  async init(app, pluginManager) {
    // Plugin initialization code
    // app: Express application instance
    // pluginManager: PluginManager instance
  }
};
```

### Plugin Examples

#### 1. Middleware Plugin

Add request processing middleware:

```javascript
module.exports = {
  metadata: {
    name: 'request-logger',
    version: '1.0.0',
    description: 'Logs all incoming requests'
  },

  async init(app, pluginManager) {
    const middleware = (req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    };

    // Register middleware through plugin manager
    pluginManager.addMiddleware(middleware);
  }
};
```

#### 2. Route Plugin

Add new API endpoints:

```javascript
module.exports = {
  metadata: {
    name: 'custom-routes',
    version: '1.0.0',
    description: 'Adds custom API endpoints'
  },

  async init(app, pluginManager) {
    // Add GET endpoint
    app.get('/api/custom', (req, res) => {
      res.json({ message: 'Hello from plugin!' });
    });

    // Add POST endpoint
    app.post('/api/custom', (req, res) => {
      res.json({ received: req.body });
    });
  }
};
```

#### 3. Hook Plugin

Transform data using hooks:

```javascript
module.exports = {
  metadata: {
    name: 'data-transformer',
    version: '1.0.0',
    description: 'Transforms data before rendering'
  },

  async init(app, pluginManager) {
    // Register a hook to transform haikus
    pluginManager.registerHook('haikus:render', (haikus) => {
      // Add uppercase version of text
      return haikus.map(haiku => ({
        ...haiku,
        upperText: haiku.text.toUpperCase()
      }));
    });

    // Register a hook that runs on app start
    pluginManager.registerHook('app:start', (data) => {
      console.log('App started on port:', data.port);
      return data;
    });
  }
};
```

#### 4. Complex Plugin with Multiple Features

```javascript
module.exports = {
  metadata: {
    name: 'analytics',
    version: '1.0.0',
    description: 'Request analytics tracking'
  },

  // Plugin state
  stats: {
    requests: 0,
    routes: {}
  },

  async init(app, pluginManager) {
    const self = this;

    // Add middleware for tracking
    const trackingMiddleware = (req, res, next) => {
      self.stats.requests++;
      const route = req.path;

      if (!self.stats.routes[route]) {
        self.stats.routes[route] = 0;
      }
      self.stats.routes[route]++;

      next();
    };

    pluginManager.addMiddleware(trackingMiddleware);

    // Add API endpoint to view stats
    app.get('/api/analytics', (req, res) => {
      res.json({
        success: true,
        data: self.stats
      });
    });

    // Register cleanup hook
    pluginManager.registerHook('app:shutdown', () => {
      console.log('Final stats:', self.stats);
    });
  }
};
```

## Available Hooks

### Built-in Hooks

| Hook Name | When It Runs | Data Passed | Can Transform |
|-----------|--------------|-------------|---------------|
| `plugins:initialized` | After all plugins load | `{ app }` | No |
| `app:start` | When server starts | `{ port, server }` | No |
| `haikus:render` | Before rendering haikus | `[haiku, ...]` | Yes |
| `haikus:filter` | When filtering haikus | `{ haikus, filter }` | Yes |

### Creating Custom Hooks

Plugins can register their own hooks and trigger them:

```javascript
// In your plugin
async init(app, pluginManager) {
  // Register a custom hook
  pluginManager.registerHook('my-plugin:event', (data) => {
    console.log('Custom event triggered:', data);
    return data;
  });

  // Trigger the hook elsewhere
  app.get('/trigger', async (req, res) => {
    const result = await pluginManager.runHook('my-plugin:event', {
      message: 'Hello'
    });
    res.json(result);
  });
}
```

## PluginManager API

### Methods

#### `register(name, plugin)`
Manually register a plugin.

```javascript
const myPlugin = {
  metadata: { name: 'test' },
  async init(app, pluginManager) {}
};

pluginManager.register('test-plugin', myPlugin);
```

#### `init(app)`
Initialize all registered plugins.

```javascript
await pluginManager.init(app);
```

#### `registerHook(hookName, callback)`
Register a callback for a specific hook.

```javascript
pluginManager.registerHook('haikus:render', (haikus) => {
  return haikus.filter(h => h.text.length > 0);
});
```

#### `runHook(hookName, data)`
Execute all callbacks for a hook.

```javascript
const transformed = await pluginManager.runHook('haikus:render', haikus);
```

#### `addMiddleware(middleware)`
Add Express middleware to the stack.

```javascript
pluginManager.addMiddleware((req, res, next) => {
  req.customData = 'value';
  next();
});
```

#### `enable(name)` / `disable(name)`
Enable or disable a plugin by name.

```javascript
pluginManager.disable('analytics');
pluginManager.enable('analytics');
```

#### `getPlugin(name)`
Get plugin information.

```javascript
const plugin = pluginManager.getPlugin('logger');
console.log(plugin.enabled, plugin.metadata);
```

#### `list()`
List all registered plugins.

```javascript
const plugins = pluginManager.list();
// [{ name: 'logger', enabled: true, metadata: {...} }, ...]
```

#### `load(pluginPath)`
Load a plugin from a file path.

```javascript
await pluginManager.load('./plugins/custom-plugin.js');
```

#### `loadFromDirectory(pluginsDir)`
Auto-load all plugins from a directory.

```javascript
await pluginManager.loadFromDirectory('./plugins');
```

## Plugin Loading Order

Plugins are loaded and initialized in this sequence:

1. **Discovery**: Scan plugins directory for `.js` files
2. **Registration**: Each plugin is registered with PluginManager
3. **Initialization**: Plugins' `init()` methods are called in order
4. **Middleware Application**: All plugin middleware is applied to Express
5. **Routes**: Application routes are registered
6. **Server Start**: Server begins listening

**Important**: Plugin order matters if plugins depend on each other. Plugins are loaded alphabetically by filename.

## Best Practices

### 1. Always Provide Metadata

```javascript
metadata: {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'Clear description of what it does',
  author: 'Your Name',
  dependencies: ['other-plugin'] // Optional: document dependencies
}
```

### 2. Handle Errors Gracefully

```javascript
async init(app, pluginManager) {
  try {
    // Your plugin code
  } catch (error) {
    console.error(`[${this.metadata.name}] Initialization failed:`, error);
    // Don't throw - allow other plugins to load
  }
}
```

### 3. Use Hooks for Data Transformation

Instead of directly modifying global data, use hooks:

```javascript
// Good
pluginManager.registerHook('haikus:render', (haikus) => {
  return haikus.map(h => ({ ...h, processed: true }));
});

// Avoid
haikus.forEach(h => h.processed = true); // Mutates global state
```

### 4. Namespace Your Routes

Prefix plugin routes to avoid conflicts:

```javascript
app.get('/api/myplugin/data', handler);  // Good
app.get('/data', handler);                // Bad - too generic
```

### 5. Clean Up Resources

If your plugin creates timers, connections, or other resources:

```javascript
async init(app, pluginManager) {
  const interval = setInterval(() => { /* ... */ }, 1000);

  pluginManager.registerHook('app:shutdown', () => {
    clearInterval(interval);
  });
}
```

## Example Plugins Included

### 1. Logger Plugin (`plugins/logger.js`)
- Logs all HTTP requests
- Includes timestamp, method, URL, status code, and duration
- Demonstrates middleware pattern

### 2. API Routes Plugin (`plugins/api-routes.js`)
- Adds RESTful endpoints for haikus
- Includes error handling
- Demonstrates route registration

### 3. Haiku Filter Plugin (`plugins/haiku-filter.js`)
- Transforms haiku data with metadata
- Uses hook system
- Demonstrates data transformation

### 4. Analytics Plugin (`plugins/analytics.js`)
- Tracks request statistics
- Provides analytics API endpoint
- Demonstrates stateful plugin

### 5. CORS Plugin (`plugins/cors.js`)
- Adds CORS headers
- Handles preflight requests
- Demonstrates security middleware

## Testing Your Plugin

### Manual Testing

1. Place your plugin in `plugins/` directory
2. Restart the application
3. Check console for initialization messages
4. Test your plugin's functionality

```bash
node index.js
# Look for: "[PluginManager] Initialized plugin: your-plugin"
```

### Programmatic Testing

```javascript
const PluginManager = require('./lib/PluginManager');
const express = require('express');

const app = express();
const pm = new PluginManager();

// Register your plugin
pm.register('test', yourPlugin);

// Initialize
await pm.init(app);

// Test
assert(pm.getPlugin('test').enabled === true);
```

## Debugging

Enable verbose logging:

```javascript
// In your plugin
async init(app, pluginManager) {
  console.log(`[${this.metadata.name}] Starting initialization...`);

  // Your code

  console.log(`[${this.metadata.name}] Initialization complete`);
}
```

Check plugin status:

```bash
curl http://localhost:3000/api/plugins
```

## Advanced Topics

### Plugin Dependencies

Document plugin dependencies in metadata:

```javascript
metadata: {
  name: 'dependent-plugin',
  dependencies: ['logger', 'analytics']
}
```

Then check dependencies during init:

```javascript
async init(app, pluginManager) {
  const deps = this.metadata.dependencies || [];

  for (const dep of deps) {
    if (!pluginManager.getPlugin(dep)) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  }
}
```

### Conditional Plugin Loading

Load plugins based on environment:

```javascript
async function loadPlugins() {
  const pluginManager = new PluginManager();

  // Always load core plugins
  await pluginManager.loadFromDirectory('./plugins/core');

  // Load dev plugins only in development
  if (process.env.NODE_ENV === 'development') {
    await pluginManager.loadFromDirectory('./plugins/dev');
  }

  return pluginManager;
}
```

### Plugin Configuration

Create a config system:

```javascript
// config/plugins.json
{
  "logger": { "enabled": true, "level": "info" },
  "analytics": { "enabled": false }
}

// In plugin
async init(app, pluginManager) {
  const config = require('../config/plugins.json')[this.metadata.name];

  if (!config.enabled) {
    console.log(`[${this.metadata.name}] Disabled via config`);
    return;
  }
}
```

## Troubleshooting

### Plugin Not Loading

1. Check file is in `plugins/` directory
2. Verify file ends with `.js`
3. Check console for error messages
4. Ensure plugin exports correct structure

### Hook Not Firing

1. Verify hook is registered before it's called
2. Check hook name spelling
3. Ensure async/await is used correctly
4. Add logging to hook callback

### Middleware Not Working

1. Check middleware is added before routes
2. Verify `next()` is called
3. Check middleware order
4. Test middleware in isolation

## Contributing Plugins

When sharing plugins:

1. Include clear metadata
2. Add usage examples in comments
3. Document any dependencies
4. Include error handling
5. Test thoroughly

## Migration Guide

### From Direct Express Code

Before:
```javascript
app.get('/api/data', (req, res) => {
  res.json({ data: 'value' });
});
```

After (as plugin):
```javascript
// plugins/data-api.js
module.exports = {
  metadata: { name: 'data-api', version: '1.0.0' },
  async init(app, pluginManager) {
    app.get('/api/data', (req, res) => {
      res.json({ data: 'value' });
    });
  }
};
```

## Resources

- Express.js Middleware: https://expressjs.com/en/guide/using-middleware.html
- Plugin Architecture Patterns: https://www.patterns.dev/
- Node.js Design Patterns: https://www.nodejsdesignpatterns.com/

## License

Same as the main application (MIT)
