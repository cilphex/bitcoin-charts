module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "brace-style": ["error", "stroustrup"],
    "comma-dangle": ["error", "always-multiline"],
    "quotes": ["error", "double"],
    // This rule raises a warning when you use single quotes in strings like "it's"
    "react/no-unescaped-entities": "off",
    "semi": ["error", "always"]
  },
  settings: {
    // Removes a warning on linting
    react: {
      version: 'detect'
    }
  }
}
