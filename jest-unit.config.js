module.exports = {
  preset: 'ts-jest', // Ensures the use of ts-jest for handling TypeScript
  testEnvironment: 'node', // Specifies the testing environment
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Adjust based on your module alias configuration
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'], // Collects coverage from the src directory
  coverageDirectory: 'coverage', // Output directory for coverage reports
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
