const { FlatCompat } = require("@eslint/eslintrc")

const compat = new FlatCompat()

module.exports = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
]
