module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-v-model-argument": "off",
    "vue/valid-v-model": "off",
    semi: ["error", "always"],
    quotes: ["error", "double"],
    indent: ["error", 2],
    "no-unused-vars": "warn",
    "vue/multi-word-component-names": "off"
  },
};
