module.exports = {
    env: {
      browser: true,
      es2021: true,
      mocha: true,
      node: true,
    },
    extends: ['standard', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      requireConfigFile: false,
      babelOptions: {
        plugins: ['@babel/plugin-syntax-import-assertions'],
      },
    },
    plugins: ['prettier', '@typescript-eslint', 'jsdoc', 'mocha', 'promise', 'import-alias'],
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'mocha/no-exclusive-tests': 'error',
      'import-alias/import-alias': ['error', {}],
    },
    overrides: [
      {
        files: ['src/**', 'index.js'],
        extends: [
          'plugin:@typescript-eslint/recommended',
          'plugin:jsdoc/recommended',
          'plugin:promise/recommended',
        ],
        parserOptions: {
          project: './tsconfig.json',
        },
        rules: {
          'no-console': 'error',
          'jsdoc/require-jsdoc': [
            'warn',
            {
              require: {
                FunctionDeclaration: true,
                MethodDefinition: true,
                ClassDeclaration: true,
                ArrowFunctionExpression: true,
                FunctionExpression: true,
              },
            },
          ],
          'jsdoc/require-param-description': 'off',
          'jsdoc/require-returns-description': 'off',
          '@typescript-eslint/no-misused-promises': 'error',
          '@typescript-eslint/no-floating-promises': 'error',
        },
      },
    ],
  }
  