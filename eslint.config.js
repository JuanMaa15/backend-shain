import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {  
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.env'
    ],
    plugins: { js }, 
    extends: ["js/recommended"], 
    rules: { 
      "indent": ["error", 2],
      "eqeqeq": ["error", "always"], 
      "no-unused-vars": ["warn"], 
      "no-undef": "error",
      "max-lines-per-function": ["warn", { "max": 35, "skipComments": true, "skipBlankLines": true }],
      "max-params": ["warn", 3],
      "prefer-const": ["warn", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }]
    }, 
  },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.json"], ignores: ["package-lock.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
]);
