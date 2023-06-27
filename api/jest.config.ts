import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: './src',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config']
};

export default config;
