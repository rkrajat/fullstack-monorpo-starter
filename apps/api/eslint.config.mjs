import nodeConfig from '@fullstack-monorepo/eslint-config/node-flat.js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**'],
  },
  ...nodeConfig.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
  })),
];
