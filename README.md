
# Haikus for Codespaces

This is a Node.js project template featuring a **robust plugin architecture** for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world).

## Features

- ✅ Express.js web framework
- ✅ EJS templating
- ✅ **Extensible plugin system**
- ✅ RESTful API endpoints
- ✅ Request logging and analytics
- ✅ CORS support
- ✅ Rate limiting
- ✅ Health check endpoint

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

The server will start on port 3000. Visit http://localhost:3000 to see the haikus!

## Plugin System

This application features a powerful plugin architecture that allows you to extend functionality without modifying core code.

### Included Plugins

1. **Logger** - HTTP request logging with timestamps
2. **API Routes** - RESTful endpoints for haikus
3. **Analytics** - Request statistics tracking
4. **CORS** - Cross-origin resource sharing
5. **Haiku Filter** - Data transformation hooks
6. **Rate Limiter** - API abuse prevention

### Available Endpoints

- `GET /` - Main haiku display page
- `GET /api/haikus` - Get all haikus (JSON)
- `GET /api/haikus/:id` - Get specific haiku by ID
- `GET /api/haikus/random` - Get random haiku
- `GET /api/health` - Health check
- `GET /api/plugins` - List loaded plugins
- `GET /api/analytics` - Request statistics
- `GET /api/rate-limit/status` - Check rate limit status

### Creating Your Own Plugin

Create a file in `plugins/` directory:

```javascript
// plugins/my-plugin.js
module.exports = {
  metadata: {
    name: 'my-plugin',
    version: '1.0.0',
    description: 'My awesome plugin'
  },

  async init(app, pluginManager) {
    // Add your routes, middleware, or hooks here
    app.get('/api/my-endpoint', (req, res) => {
      res.json({ message: 'Hello from my plugin!' });
    });
  }
};
```

See [PLUGIN_SYSTEM.md](PLUGIN_SYSTEM.md) for complete documentation.

## Documentation

- [Plugin System Guide](PLUGIN_SYSTEM.md) - Comprehensive plugin development guide
- [Bug Report](BUG_REPORT.md) - Testing results and known issues

## GitHub Codespaces

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

## Project Structure

```
.
├── index.js              # Main application entry point
├── lib/
│   └── PluginManager.js  # Plugin system core
├── plugins/              # Plugin directory (auto-loaded)
│   ├── logger.js
│   ├── api-routes.js
│   ├── analytics.js
│   ├── cors.js
│   ├── haiku-filter.js
│   └── rate-limiter.js
├── views/
│   └── index.ejs         # Main template
├── public/               # Static files
│   ├── css/
│   └── images/
├── haikus.json          # Haiku data
└── package.json         # Dependencies
```

## License

MIT
