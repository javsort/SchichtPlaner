module.exports = {
  webpack: (config, env) => {
    return config;
  },
  jest: (config) => {
    // Transform axios (an ESM module) even if it is in node_modules
    config.transformIgnorePatterns = ["/node_modules/(?!axios)"];

    // Ensure Jest recognizes absolute imports
    config.moduleNameMapper = {
      "\\.(css|less)$": "identity-obj-proxy",
      "^src/(.*)$": "<rootDir>/src/$1",  // ✅ Absolute path alias for `src`
      "^@services/(.*)$": "<rootDir>/src/Services/$1" // ✅ Alias for `Services`
    };

    // Ensure Jest looks in `src` for modules before `node_modules`
    config.moduleDirectories = ["node_modules", "src"];

    return config;
  }
};
