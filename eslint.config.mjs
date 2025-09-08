import { defineConfig } from 'eslint/config'
import globals from 'globals'
import pluginJS from '@eslint/js'
import pluginTS from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import parserVue from 'vue-eslint-parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  {
    ignores: [
      'dist',
      'src/static',
      'node_modules',
      'src/pages.json',
      'src/uni_modules',
      'src/manifest.json',
      '*.svg',
      '*.d.ts',
      '*.min.js',
      'build/*.js',
      'logs',
      '*.log',
      '.husky'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
      ecmaVersion: 2021,
      sourceType: 'module'
    }
  },
  pluginJS.configs.recommended,
  ...pluginTS.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['*.js', '**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off' // 允许 require 导入
    }
  },
  {
    files: ['*.ts', '**/*.ts'],
    languageOptions: {
      parser: pluginTS.parser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 允许 any
      '@typescript-eslint/no-empty-function': 'off', // 允许空函数
      '@typescript-eslint/no-empty-object-type': 'off' // 允许空对象
    }
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: parserVue,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: pluginTS.parser,
        ecmaFeatures: {
          globalReturn: false,
          impliedStrict: false,
          jsx: true
        }
      }
    }
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
  }
])
