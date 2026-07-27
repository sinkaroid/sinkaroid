import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
    {
        ignores: ["dist/**", "node_modules/**", "legacy/**", ".agents/**"]
    },
    js.configs.recommended,
    ...vuePlugin.configs["flat/recommended"],
    {
        files: ["**/*.{js,ts,vue}"],
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                localStorage: "readonly",
                navigator: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                fetch: "readonly",
                process: "readonly",
                Buffer: "readonly",
                RequestInit: "readonly",
                URL: "readonly",
                URLSearchParams: "readonly",
                Blob: "readonly",
                FileReader: "readonly",
                FormData: "readonly",
                Headers: "readonly",
                Response: "readonly",
                Path: "readonly"
            }
        }
    },
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: "latest",
                sourceType: "module"
            }
        }
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            parser: tsParser
        }
    },
    {
        rules: {
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            "vue/no-v-model-argument": "off",
            "vue/valid-v-model": "off",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 4, { SwitchCase: 0 }],
            "no-unused-vars": "warn",
            "vue/multi-word-component-names": "off",
            "prefer-const": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "vue/no-v-html": "error"
        }
    },
    {
        files: ["**/*.vue"],
        rules: {
            indent: "off"
        }
    }
];
