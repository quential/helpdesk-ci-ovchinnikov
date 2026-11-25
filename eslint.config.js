module.exports = [{
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'commonjs',
    globals: {
      process: 'readonly', console: 'readonly', fetch: 'readonly',
      test: 'readonly', expect: 'readonly', beforeAll: 'readonly', afterAll: 'readonly'
    }
  },
  rules: { 'no-unused-vars': 'error', 'no-undef': 'error', eqeqeq: 'error' }
}];
