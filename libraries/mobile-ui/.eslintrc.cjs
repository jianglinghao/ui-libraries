module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    'arrow-body-style': 0,
    'no-param-reassign': 1,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    "semi": [2, "always"],
    "@typescript-eslint/no-explicit-any": 0,
    'no-unused-vars': 1,
    'max-len': [1, { code: 200 }],
  },
};
