const fs = require('fs');
const { execSync } = require('child_process')
const path = require('path');

// Function to create directories if they don't exist
function createDirectories(dirs) {
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

execSync('npm init -y');
execSync('npm install prompt-sync');

const prompt = require('prompt-sync')();


// Function to re-prompt if input is empty
function getInput(fieldName) {
  let input = '';
  while (!input) {
    input = prompt(`Enter ${fieldName}: `);
    if (!input) {
      console.log(`\x1b[31mWarning: ${fieldName} cannot be empty!\x1b[0m`);
    }
  }
  return input;
}

// Prompt user for input with re-prompting if left empty
const PROJECT_NAME = getInput('project name');
const DB_NAME = getInput('base database name (will be used for prod, dev, and test)');
const DB_USER = getInput('database user');
const DB_PASS = getInput('database password');
const DB_NAME_DEV = DB_NAME + '_dev';
const DB_NAME_TEST = DB_NAME + '_test';


// Initialize npm and install dependencies
execSync('npm install express dotenv cors');
execSync('npm install --save-dev nodemon eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser typescript jasmine supertest @types/supertest @types/express');

// Create folder structure (Cross-platform)
createDirectories([
  path.join('src', 'controllers'),
  path.join('src', 'routes'),
  path.join('src', 'models'),
  path.join('src', 'middleware'),
  path.join('src', 'tests')
]);

// Create starter files
fs.writeFileSync('src/index.ts', `import express from 'express';\nconst app = express();\napp.use(express.json());\napp.listen(3000, () => console.log('Server running on http://localhost:3000'));\n`);

// Create tsconfig.json
fs.writeFileSync('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: "es2020",
    module: "commonjs",
    strict: true,
    noImplicitAny: true,
    esModuleInterop: true,
    skipLibCheck: true
  },
  exclude: ["node_modules"]
}, null, 2));

// Create .env file
fs.writeFileSync('.env', `DB_NAME=${DB_NAME}\nDB_USER=${DB_USER}\nDB_PASS=${DB_PASS}\nDB_NAME_DEV=${DB_NAME_DEV}\nDB_NAME_TEST=${DB_NAME_TEST}`);

// Setup ESLint and Prettier
fs.writeFileSync('.eslintrc.json', JSON.stringify({
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-use-before-define": ["error", { "functions": true, "classes": true }],
    "no-var": "error",
    "prefer-const": "error"
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  env: {
    node: true,
    es6: true
  }
}, null, 2));

// Create .prettierrc file
fs.writeFileSync('.prettierrc', JSON.stringify({
  semi: true,
  trailingComma: "none",
  singleQuote: true,
  printWidth: 80
}, null, 2));

// Create database configuration with dev, test, and production
fs.writeFileSync('database.json', JSON.stringify({
  prod: {
    driver: "pg",
    host: "127.0.0.1",
    database: { "ENV": "DB_NAME" },
    user: { "ENV": "DB_USER" },
    password: { "ENV": "DB_PASS" }
  },
  dev: {
    driver: "pg",
    host: "127.0.0.1",
    database: { "ENV": "DB_NAME_DEV" },
    user: { "ENV": "DB_USER" },
    password: { "ENV": "DB_PASS" }
  },
  test: {
    driver: "pg",
    host: "127.0.0.1",
    database: { "ENV": "DB_NAME_TEST" },
    user: { "ENV": "DB_USER" },
    password: { "ENV": "DB_PASS" }
  }
}, null, 2));

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.type = 'module';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Log the database names
console.log(`\nDatabase Names:`);
console.log(`Production DB: ${DB_NAME}`);
console.log(`Development DB: ${DB_NAME_DEV}`);
console.log(`Testing DB: ${DB_NAME_TEST}`);

console.log(`\nSetup complete! Navigate to ${PROJECT_NAME} and start coding.`);