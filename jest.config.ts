
  import type { Config } from '@jest/types';
  
  const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    testMatch: ['**/src/**/*.test.ts'],
  };
  
  export default config;
  