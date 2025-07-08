#!/usr/bin/env node

/**
 * Security Test Suite for Kala Jewelry E-commerce
 * 
 * This script demonstrates the security vulnerabilities that were fixed.
 * Run with: node security-tests.js
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3001';
const ADMIN_KEY = 'kala-admin-2024';

console.log('🔒 Kala Jewelry Security Test Suite');
console.log('=====================================\n');

/**
 * Test 1: Path Traversal Attack
 */
async function testPathTraversal() {
  console.log('🔴 Test 1: Path Traversal Attack');
  console.log('Attempting to upload file with malicious path...\n');

  const maliciousPayload = '../../../etc/passwd';
  
  try {
    const formData = new FormData();
    formData.append('adminKey', ADMIN_KEY);
    formData.append('category', maliciousPayload);
    formData.append('image', new Blob(['malicious content'], { type: 'image/jpeg' }), 'test.jpg');

    const response = await fetch(`${BASE_URL}/api/upload-image`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (response.status === 400 && result.message.includes('Invalid category')) {
      console.log('✅ PASS: Path traversal attack blocked');
      console.log(`   Response: ${result.message}\n`);
    } else {
      console.log('❌ FAIL: Path traversal attack not properly blocked');
      console.log(`   Response: ${JSON.stringify(result)}\n`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }
}

/**
 * Test 2: Rate Limiting Test
 */
async function testRateLimiting() {
  console.log('🟡 Test 2: Rate Limiting');
  console.log('Sending rapid requests to test rate limiting...\n');

  const orderData = {
    customer: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    },
    items: [{
      id: 'test',
      name: 'Test Ring',
      price: 100,
      quantity: 1,
      category: 'rings'
    }],
    subtotal: 100
  };

  let rateLimitTriggered = false;
  
  // Send 10 rapid requests
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/send-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.status === 429) {
        console.log(`✅ PASS: Rate limiting triggered on request ${i + 1}`);
        rateLimitTriggered = true;
        break;
      }
    } catch (error) {
      console.log(`Request ${i + 1} failed: ${error.message}`);
    }
  }

  if (!rateLimitTriggered) {
    console.log('❌ FAIL: Rate limiting not triggered after 10 requests');
  }
  console.log('');
}

/**
 * Test 3: Authentication Security
 */
async function testAuthentication() {
  console.log('🔴 Test 3: Authentication Security');
  console.log('Testing admin endpoint access control...\n');

  const testCases = [
    { key: '', description: 'Empty admin key' },
    { key: 'wrong-key', description: 'Wrong admin key' },
    { key: 'kala-admin-2023', description: 'Similar but wrong key' },
    { key: ADMIN_KEY, description: 'Correct admin key' }
  ];

  for (const testCase of testCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products?adminKey=${encodeURIComponent(testCase.key)}`);
      const result = await response.json();

      if (testCase.key === ADMIN_KEY) {
        if (response.status === 200) {
          console.log(`✅ PASS: ${testCase.description} - Access granted`);
        } else {
          console.log(`❌ FAIL: ${testCase.description} - Access denied incorrectly`);
        }
      } else {
        if (response.status === 401) {
          console.log(`✅ PASS: ${testCase.description} - Access properly denied`);
        } else {
          console.log(`❌ FAIL: ${testCase.description} - Should be denied but wasn't`);
        }
      }
    } catch (error) {
      console.log(`❌ ERROR testing ${testCase.description}: ${error.message}`);
    }
  }
  console.log('');
}

/**
 * Test 4: Input Validation
 */
async function testInputValidation() {
  console.log('🟡 Test 4: Input Validation');
  console.log('Testing malicious input handling...\n');

  const maliciousInputs = [
    { name: '<script>alert("xss")</script>', description: 'XSS attempt in product name' },
    { name: 'A'.repeat(1000), description: 'Extremely long product name' },
    { price: -100, description: 'Negative price' },
    { price: 'not-a-number', description: 'Non-numeric price' },
    { category: 'invalid-category', description: 'Invalid category' }
  ];

  for (const input of maliciousInputs) {
    try {
      const productData = {
        adminKey: ADMIN_KEY,
        name: input.name || 'Test Product',
        price: input.price || 100,
        category: input.category || 'rings',
        description: 'Test description',
        stock: 10,
        lowStockThreshold: 5
      };

      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.status === 400) {
        console.log(`✅ PASS: ${input.description} - Properly rejected`);
      } else {
        console.log(`❌ FAIL: ${input.description} - Should be rejected`);
        console.log(`   Response: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(`❌ ERROR testing ${input.description}: ${error.message}`);
    }
  }
  console.log('');
}

/**
 * Test 5: Security Headers
 */
async function testSecurityHeaders() {
  console.log('🛡️ Test 5: Security Headers');
  console.log('Checking for security headers...\n');

  try {
    const response = await fetch(`${BASE_URL}/`);
    
    const expectedHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
      'x-xss-protection',
      'strict-transport-security'
    ];

    for (const header of expectedHeaders) {
      const headerValue = response.headers.get(header);
      if (headerValue) {
        console.log(`✅ PASS: ${header} present - ${headerValue}`);
      } else {
        console.log(`❌ FAIL: ${header} missing`);
      }
    }
  } catch (error) {
    console.log(`❌ ERROR checking headers: ${error.message}`);
  }
  console.log('');
}

/**
 * Main test runner
 */
async function runSecurityTests() {
  console.log('Starting security tests...\n');
  
  // Check if server is running
  try {
    await fetch(`${BASE_URL}/`);
  } catch (error) {
    console.log('❌ ERROR: Server not running. Please start with "npm run dev"\n');
    return;
  }

  await testPathTraversal();
  await testAuthentication();
  await testInputValidation();
  await testRateLimiting();
  await testSecurityHeaders();

  console.log('🔒 Security test suite completed!');
  console.log('=====================================');
}

// Only run if this file is executed directly
if (require.main === module) {
  runSecurityTests().catch(console.error);
}

module.exports = {
  testPathTraversal,
  testAuthentication,
  testInputValidation,
  testRateLimiting,
  testSecurityHeaders
};
