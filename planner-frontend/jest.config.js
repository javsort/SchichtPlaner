module.exports = {
  webpack: (config, env) => {
    // (Optional) Modify your webpack config here if needed.
    return config;
  },
  jest: (config) => {
    // Transform axios (an ESM module) even if it is in node_modules
    config.transformIgnorePatterns = ["/node_modules/(?!axios)"];
    // Map CSS/LESS files to identity-obj-proxy so Jest mocks them instead of parsing
    config.moduleNameMapper = {
      "\\.(css|less)$": "identity-obj-proxy"
    };
    return config;
  }
};
