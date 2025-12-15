const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve modules from the monorepo root
config.watchFolders = [
  path.resolve(__dirname, '../..'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, './node_modules'),
];

// Add resolver for our shared package
config.resolver.extraNodeModules = {
  '@nuur-fashion-commerce/shared': path.resolve(__dirname, '../../packages/shared/src'),
};

module.exports = config;