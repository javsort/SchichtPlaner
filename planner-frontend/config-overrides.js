module.exports = {
  webpack: (config, env) => {
    return config;
  },
  jest: (config) => {
    // Ensure axios (and similar modules) are transformed
    config.transformIgnorePatterns = ["/node_modules/(?!axios)"];
    // Map CSS and LESS files to identity-obj-proxy so they’re mocked
    config.moduleNameMapper = {
      "\\.(css|less)$": "identity-obj-proxy"
    };
    return config;
  }
};
