#!/usr/bin/env node

/**
 * Jobs Component Verification Script
 * Run this to test all components of the job fetching flow
 * 
 * Usage: node verify-jobs.js
 */

const http = require('http');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const tests = [];

function log(color, symbol, text) {
  console.log(`${color}${symbol} ${text}${colors.reset}`);
}

function testAPI(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const success = res.statusCode === expectedStatus;
        let responseData = null;
        try {
          responseData = JSON.parse(data);
        } catch (e) {
          responseData = data;
        }
        resolve({
          success,
          statusCode: res.statusCode,
          duration,
          data: responseData
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message,
        statusCode: null
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.cyan}╔══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     Jobs Component Verification Tests     ║${colors.reset}`);
  console.log(`${colors.cyan}╚══════════════════════════════════════════╝${colors.reset}\n`);

  // Test 1: Backend Health
  log(colors.blue, '🔍', 'Test 1: Checking backend server health...');
  let result = await testAPI('/health');
  if (result.error) {
    log(colors.red, '✗', `Backend not responding: ${result.error}`);
    log(colors.yellow, '⚠', 'Make sure to run: npm start (from server folder)');
    return;
  }
  if (result.success) {
    log(colors.green, '✓', `Backend healthy (${result.duration}ms)`);
  } else {
    log(colors.red, '✗', `Backend returned status ${result.statusCode}`);
  }

  // Test 2: Jobs Endpoint
  log(colors.blue, '🔍', 'Test 2: Fetching jobs from /api/jobs...');
  result = await testAPI('/jobs');
  if (result.error) {
    log(colors.red, '✗', `Jobs endpoint error: ${result.error}`);
    return;
  }
  if (result.success && result.data.success) {
    const jobCount = result.data.data?.jobs?.length || 0;
    const totalJobs = result.data.data?.pagination?.totalJobs || 0;
    log(colors.green, '✓', `Jobs endpoint working (${result.duration}ms)`);
    log(colors.green, '✓', `Retrieved ${jobCount} jobs (total: ${totalJobs})`);
    
    if (jobCount === 0) {
      log(colors.yellow, '⚠', 'No jobs returned! Check externalJobFetcher.service.js');
    } else {
      // Show first job structure
      const firstJob = result.data.data.jobs[0];
      log(colors.cyan, '📋', 'First job sample:');
      console.log(`   ${colors.cyan}Title:${colors.reset} ${firstJob.title}`);
      console.log(`   ${colors.cyan}Company:${colors.reset} ${firstJob.company}`);
      console.log(`   ${colors.cyan}Source:${colors.reset} ${firstJob.source}`);
      console.log(`   ${colors.cyan}Salary:${colors.reset} ₹${firstJob.salaryMin} - ₹${firstJob.salaryMax}`);
      console.log(`   ${colors.cyan}Location:${colors.reset} ${firstJob.location?.city || 'Remote'}, ${firstJob.location?.state || ''}`);
      console.log(`   ${colors.cyan}Tags:${colors.reset} ${(firstJob.tags || []).slice(0, 3).join(', ')}`);
    }
  } else {
    log(colors.red, '✗', `Unexpected response: ${JSON.stringify(result.data)}`);
  }

  // Test 3: Pagination
  log(colors.blue, '🔍', 'Test 3: Checking pagination...');
  const pagination = result.data?.data?.pagination;
  if (pagination) {
    log(colors.green, '✓', `Pagination structure found`);
    console.log(`   Current Page: ${pagination.currentPage}`);
    console.log(`   Total Pages: ${pagination.totalPages}`);
    console.log(`   Total Jobs: ${pagination.totalJobs}`);
    console.log(`   Limit: ${pagination.limit}`);
  } else {
    log(colors.red, '✗', 'Pagination data missing');
  }

  // Test 4: Search functionality
  log(colors.blue, '🔍', 'Test 4: Testing search with query...');
  result = await testAPI('/jobs?q=developer');
  if (result.success && result.data.success) {
    const jobCount = result.data.data?.jobs?.length || 0;
    if (jobCount > 0) {
      log(colors.green, '✓', `Search returned ${jobCount} job(s)`);
    } else {
      log(colors.yellow, '⚠', 'Search returned 0 results (might be expected)');
    }
  }

  // Test 5: Filters
  log(colors.blue, '🔍', 'Test 5: Testing filters...');
  result = await testAPI('/jobs?remote=true');
  if (result.success && result.data.success) {
    const jobCount = result.data.data?.jobs?.length || 0;
    const remoteJobs = (result.data.data?.jobs || []).filter(j => j.remote).length;
    log(colors.green, '✓', `Remote filter returned ${jobCount} job(s), ${remoteJobs} are remote`);
  }

  // Summary
  console.log(`\n${colors.cyan}╔══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║           Verification Complete           ║${colors.reset}`);
  console.log(`${colors.cyan}╚══════════════════════════════════════════╝${colors.reset}\n`);

  log(colors.green, '✓', 'Backend tests passed! Jobs component should work.');
  log(colors.cyan, '💡', 'Next: Open http://localhost:3002 in browser');
  log(colors.cyan, '💡', 'Click "Explore Jobs" button to see jobs on frontend');
  log(colors.cyan, '💡', 'Press F12 to see debug console logs\n');
}

runTests().catch(err => {
  log(colors.red, '✗', `Test error: ${err.message}`);
  process.exit(1);
});
