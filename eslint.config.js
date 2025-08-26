import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat()

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
]
