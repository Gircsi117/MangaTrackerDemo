const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

const originalTransformRequest = config.transformer.babelTransformerPath;

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "sql"
);

module.exports = config;