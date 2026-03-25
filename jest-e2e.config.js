module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['**/*.e2e-test.ts'], // Adjust test match pattern for E2E tests
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // Additional configuration for E2E tests, if needed
};
