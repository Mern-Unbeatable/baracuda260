/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',

  // Runs after the test framework is installed — extends expect with jest-dom matchers
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Use inline babel config scoped to Jest — leaves .babelrc untouched (webpack uses it)
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },

  // Map static assets that would otherwise break the import
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(jpg|jpeg|png|gif|svg|ico|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
  },

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.jsx',
    '!src/**/__tests__/**',
    '!src/__mocks__/**',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
