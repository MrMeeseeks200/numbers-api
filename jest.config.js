// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // or 'jsdom' for browser-like environments
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    // Further configurations like moduleNameMapper, coverage settings, etc.
};