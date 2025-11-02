/**
 * Haiku Filter Plugin
 * Provides data transformation hooks for haikus
 */

module.exports = {
  metadata: {
    name: 'haiku-filter',
    version: '1.0.0',
    description: 'Transforms and filters haiku data',
    author: 'Plugin System'
  },

  async init(app, pluginManager) {
    // Hook to transform haikus before rendering
    pluginManager.registerHook('haikus:render', (haikus) => {
      // Add metadata to each haiku
      return haikus.map((haiku, index) => ({
        ...haiku,
        id: index,
        wordCount: haiku.text.split(/\s+/).length,
        lineCount: haiku.text.split('\n').length,
        hasImage: !!haiku.image
      }));
    });

    // Hook to filter haikus
    pluginManager.registerHook('haikus:filter', (data) => {
      const { haikus, filter } = data;

      if (!filter) {
        return { haikus, filter };
      }

      const filtered = haikus.filter(haiku => {
        if (filter.hasImage !== undefined) {
          return !!haiku.image === filter.hasImage;
        }
        return true;
      });

      return { haikus: filtered, filter };
    });

    console.log('[Haiku Filter Plugin] Registered haiku transformation hooks');
  }
};
