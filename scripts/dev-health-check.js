#!/usr/bin/env node

/**
 * Development Health Check Script
 * Validates that all development dependencies and configurations are working
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    log(`✅ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description}`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    log(`   Missing: ${filePath}`, 'red');
    return false;
  }
}

function checkEnvFile(filePath, requiredVars) {
  if (!fs.existsSync(filePath)) {
    log(`❌ Environment file exists: ${filePath}`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missing = requiredVars.filter(varName => !content.includes(`${varName}=`));
  
  if (missing.length === 0) {
    log(`✅ Environment variables configured: ${filePath}`, 'green');
    return true;
  } else {
    log(`⚠️  Missing environment variables in ${filePath}:`, 'yellow');
    missing.forEach(varName => log(`   - ${varName}`, 'yellow'));
    return false;
  }
}

async function runHealthCheck() {
  log('\n🔍 AI Resume Tailor - Development Health Check', 'blue');
  log('===============================================\n', 'blue');

  let allPassed = true;

  // Check Node.js and npm
  log('📦 Node.js Environment:', 'blue');
  allPassed &= checkCommand('node --version', 'Node.js installed');
  allPassed &= checkCommand('npm --version', 'npm installed');

  // Check frontend dependencies
  log('\n🎨 Frontend Dependencies:', 'blue');
  allPassed &= checkFile('client/package.json', 'package.json exists');
  allPassed &= checkFile('client/node_modules', 'node_modules installed');
  allPassed &= checkCommand('cd client && npm run build', 'Frontend builds successfully');

  // Check backend dependencies
  log('\n🐍 Backend Dependencies:', 'blue');
  allPassed &= checkFile('server/requirements.txt', 'requirements.txt exists');
  allPassed &= checkFile('server/venv', 'Virtual environment exists');

  // Check environment files
  log('\n🔧 Environment Configuration:', 'blue');
  allPassed &= checkEnvFile('client/.env', ['VITE_API_URL']);
  allPassed &= checkEnvFile('server/.env', ['OPENAI_API_KEY', 'FRONTEND_URL']);

  // Check key project files
  log('\n📁 Project Structure:', 'blue');
  allPassed &= checkFile('server/app.py', 'Flask app exists');
  allPassed &= checkFile('client/src/pages/Analyze.tsx', 'Analyze page exists');
  allPassed &= checkFile('START_DEV.bat', 'Development script exists');

  // Summary
  log('\n📊 Health Check Summary:', 'blue');
  log('===============================================\n', 'blue');
  
  if (allPassed) {
    log('🎉 All checks passed! Your development environment is ready.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Run START_DEV.bat to start both servers', 'blue');
    log('2. Open http://localhost:3000 to view the app', 'blue');
    log('3. Check the contribution guide: CONTRIBUTING.md', 'blue');
  } else {
    log('⚠️  Some checks failed. Please fix the issues above.', 'yellow');
    log('\nCommon fixes:', 'blue');
    log('1. Install frontend dependencies: cd client && npm install', 'blue');
    log('2. Setup backend: cd server && python -m venv venv && venv\\Scripts\\activate && pip install -r requirements.txt', 'blue');
    log('3. Configure environment files from .env.example templates', 'blue');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run the health check
runHealthCheck().catch(console.error);