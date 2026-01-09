const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Block local node_modules in packages/api to prevent duplicates
// Using platform-agnostic regex for path separators
const manualBlockList = /packages[\\/](api|shared)[\\/]node_modules[\\/].*$/;

// Merge with existing blockList if any
if (config.resolver.blockList) {
  config.resolver.blockList = new RegExp(
    `(${config.resolver.blockList.source})|(${manualBlockList.source})`
  );
} else {
  config.resolver.blockList = manualBlockList;
}

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  '@tanstack/react-query': path.resolve(projectRoot, 'node_modules/@tanstack/react-query'),
  '@nuur-fashion-commerce/shared': path.resolve(monorepoRoot, 'packages/shared/src'),
  '@nuur-fashion-commerce/api': path.resolve(monorepoRoot, 'packages/api/src'),
};

module.exports = config;