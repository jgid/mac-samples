/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          isolatedModules: true,
          module: 'commonjs',
          moduleResolution: 'node10',
          target: 'es2020',
          lib: ['DOM', 'ESNext'],
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          jsx: 'react-jsx',
          ignoreDeprecations: '6.0',
        },
      },
    ],
  },
};
