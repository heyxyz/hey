const { makeMetroConfig } = require('@rnx-kit/metro-config');

const path = require('path');

const { getDefaultConfig } = require('expo/metro-config');
const expoDefaultConfig = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const metroConfig = makeMetroConfig({
  ...expoDefaultConfig,
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    ...expoDefaultConfig.resolver,
    disableHierarchicalLookup: false,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules')
    ],
    resolveRequest: (context, moduleName, platform) => {
      return context.resolveRequest(context, moduleName, platform);
    },
    platforms: ['ios', 'android']
  },
  transformer: {
    ...expoDefaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
});

module.exports = metroConfig;
