module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    worker: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Error Prevention
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-shadow': 'error',
    
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-await': 'error',
    'require-await': 'warn',
    'no-throw-literal': 'error',
    
    // Security
    'no-script-url': 'error',
    
    // Code Quality
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
    'complexity': ['warn', 15],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 3],
    
    // Async/Await
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'prefer-promise-reject-errors': 'error',
    
    // Modern JavaScript
    'prefer-arrow-callback': 'error',
    'prefer-template': 'warn',
    'prefer-destructuring': ['warn', {
      array: false,
      object: true,
    }],
    'object-shorthand': ['warn', 'always'],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    
    // Accessibility (for any HTML/JSX generation)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.property.name="innerHTML"]',
        message: 'Avoid using innerHTML; use textContent or DOM methods instead for security.',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: {
        'jest/expect-expect': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/valid-expect': 'error',
      },
    },
    {
      files: ['cloudflare/workers/**/*.js'],
      env: {
        worker: true,
        browser: false,
        node: false,
      },
      globals: {
        // Cloudflare Workers globals
        caches: 'readonly',
        crypto: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
        FetchEvent: 'readonly',
        ReadableStream: 'readonly',
        WritableStream: 'readonly',
        TransformStream: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
      },
      rules: {
        // Workers-specific rules
        'no-restricted-globals': [
          'error',
          {
            name: 'window',
            message: 'window is not available in Cloudflare Workers.',
          },
          {
            name: 'document',
            message: 'document is not available in Cloudflare Workers.',
          },
          {
            name: 'localStorage',
            message: 'localStorage is not available in Cloudflare Workers. Use KV instead.',
          },
        ],
      },
    },
  ],
};
