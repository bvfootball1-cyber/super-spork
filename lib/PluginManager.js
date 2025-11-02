/**
 * Plugin Manager for Express Application
 * Implements a robust plugin architecture with hooks and middleware support
 */

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
    this.middleware = [];
    this.initialized = false;
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {Object} plugin - Plugin instance with init method
   */
  register(name, plugin) {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already registered`);
    }

    if (!plugin.init || typeof plugin.init !== 'function') {
      throw new Error(`Plugin "${name}" must have an init() method`);
    }

    this.plugins.set(name, {
      instance: plugin,
      enabled: true,
      metadata: plugin.metadata || {}
    });

    console.log(`[PluginManager] Registered plugin: ${name}`);
    return this;
  }

  /**
   * Initialize all registered plugins
   * @param {Object} app - Express app instance
   */
  async init(app) {
    if (this.initialized) {
      console.warn('[PluginManager] Already initialized');
      return;
    }

    console.log(`[PluginManager] Initializing ${this.plugins.size} plugins...`);

    for (const [name, pluginData] of this.plugins) {
      if (!pluginData.enabled) {
        console.log(`[PluginManager] Skipping disabled plugin: ${name}`);
        continue;
      }

      try {
        await pluginData.instance.init(app, this);
        console.log(`[PluginManager] Initialized plugin: ${name}`);
      } catch (error) {
        console.error(`[PluginManager] Failed to initialize plugin "${name}":`, error);
        throw error;
      }
    }

    this.initialized = true;
    await this.runHook('plugins:initialized', { app });
  }

  /**
   * Register a hook callback
   * @param {string} hookName - Name of the hook
   * @param {Function} callback - Callback function
   */
  registerHook(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
  }

  /**
   * Run all callbacks for a hook
   * @param {string} hookName - Name of the hook to run
   * @param {*} data - Data to pass to callbacks
   */
  async runHook(hookName, data) {
    const callbacks = this.hooks.get(hookName) || [];
    let result = data;

    for (const callback of callbacks) {
      try {
        const output = await callback(result);
        // Allow hooks to transform data
        if (output !== undefined) {
          result = output;
        }
      } catch (error) {
        console.error(`[PluginManager] Error in hook "${hookName}":`, error);
      }
    }

    return result;
  }

  /**
   * Add middleware to the stack
   * @param {Function} middleware - Express middleware function
   */
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Get all registered middleware
   */
  getMiddleware() {
    return this.middleware;
  }

  /**
   * Enable a plugin
   * @param {string} name - Plugin name
   */
  enable(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }
    plugin.enabled = true;
  }

  /**
   * Disable a plugin
   * @param {string} name - Plugin name
   */
  disable(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }
    plugin.enabled = false;
  }

  /**
   * Get plugin info
   * @param {string} name - Plugin name
   */
  getPlugin(name) {
    return this.plugins.get(name);
  }

  /**
   * List all plugins
   */
  list() {
    return Array.from(this.plugins.entries()).map(([name, data]) => ({
      name,
      enabled: data.enabled,
      metadata: data.metadata
    }));
  }

  /**
   * Load plugin from file
   * @param {string} pluginPath - Path to plugin file
   */
  async load(pluginPath) {
    try {
      const plugin = require(pluginPath);
      const name = plugin.metadata?.name || pluginPath.split('/').pop().replace('.js', '');
      this.register(name, plugin);
      return name;
    } catch (error) {
      console.error(`[PluginManager] Failed to load plugin from "${pluginPath}":`, error);
      throw error;
    }
  }

  /**
   * Auto-load plugins from directory
   * @param {string} pluginsDir - Directory containing plugins
   */
  async loadFromDirectory(pluginsDir) {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(pluginsDir)) {
      console.warn(`[PluginManager] Plugins directory not found: ${pluginsDir}`);
      return;
    }

    const files = fs.readdirSync(pluginsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(pluginsDir, file));

    console.log(`[PluginManager] Loading ${files.length} plugins from ${pluginsDir}`);

    for (const file of files) {
      try {
        await this.load(file);
      } catch (error) {
        console.error(`[PluginManager] Failed to load ${file}:`, error.message);
      }
    }
  }
}

module.exports = PluginManager;
