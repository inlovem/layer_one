// jest.config.js
module.exports = {
    preset: 'ts-jest',             // Use ts-jest preset
    testEnvironment: 'node',        // Use the Node environment
    moduleFileExtensions: ['ts', 'js'], // Support TypeScript and JavaScript files
    testMatch: ['**/tests/**/*.test.(ts|js)'], // Look for test files in the tests folder
    testPathIgnorePatterns: ['<rootDir>/dist/'],  // Ignore the dist folder
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
      },
  };
  