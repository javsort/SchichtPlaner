import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1" // Ensure Jest recognizes "@/services/api"
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleDirectories: ["node_modules", "src"],

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  clearMocks: true,
};

export default config;

