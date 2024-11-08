const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("node:path");

const projectRoot = __dirname;
const monorepoRoot = resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  resolve(projectRoot, "node_modules"),
  resolve(monorepoRoot, "node_modules")
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
