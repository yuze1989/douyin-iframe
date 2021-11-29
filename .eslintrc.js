module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['react-app', 'airbnb', 'plugin:react/recommended'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
    'import/extensions': 0,
  },
  // parser: 'babel-eslint',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // 'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/display-name': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/no-unresolved': [
      2,
      {
        ignore: ['antd-mobile', 'rc-menu', 'utils', 'types', 'assets', 'router'],
      },
    ],
    'linebreak-style': 0,
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-uses-react': 2,
    'no-use-before-define': 'off',
    'no-unused-vars': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-wrap-multilines': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
  },
};
