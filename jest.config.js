module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  testPathIgnorePatterns: [
    '<rootDir>/src/*'
  ],
  collectCoverageFrom: [
    'lib/**/*.js',
    'simctl.js'
  ]
}
