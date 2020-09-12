// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  testEnvironment: 'jest-environment-jsdom',
  verbose: true,

  // Automatically reset mock state between every test
  resetMocks: true,

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: '50%',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed
  // setupFilesAfterEnv: ['./tests/jest.setup.ts'],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: path.join(__dirname, 'tests/setup.ts'),

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},
};
