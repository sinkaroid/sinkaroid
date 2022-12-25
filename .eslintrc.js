module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
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
  },
};
