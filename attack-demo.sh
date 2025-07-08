#!/bin/bash

# Security Attack Demonstration Script
# This script shows various attack vectors and how they are now blocked

echo "🔒 Kala Jewelry Security Attack Demonstrations"
echo "=============================================="
echo ""

BASE_URL="http://localhost:3001"
ADMIN_KEY="kala-admin-2024"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Starting attack demonstrations..."
echo ""

# Test 1: Path Traversal Attack
echo -e "${RED}🔴 ATTACK 1: Path Traversal${NC}"
echo "Attempting to upload file outside intended directory..."

# Create a malicious file
echo "This is a malicious payload" > /tmp/malicious.txt

# Attempt path traversal
echo "curl -X POST $BASE_URL/api/upload-image \\"
echo "  -F \"adminKey=$ADMIN_KEY\" \\"
echo "  -F \"category=../../../tmp\" \\"
echo "  -F \"image=@/tmp/malicious.txt\""
echo ""

response=$(curl -s -X POST "$BASE_URL/api/upload-image" \
  -F "adminKey=$ADMIN_KEY" \
  -F "category=../../../tmp" \
  -F "image=@/tmp/malicious.txt")

if echo "$response" | grep -q "Invalid category"; then
    echo -e "${GREEN}✅ BLOCKED: Path traversal attack prevented${NC}"
else
    echo -e "${RED}❌ VULNERABLE: Path traversal attack succeeded${NC}"
fi
echo "Response: $response"
echo ""

# Test 2: File Type Spoofing
echo -e "${RED}🔴 ATTACK 2: File Type Spoofing${NC}"
echo "Attempting to upload PHP script disguised as image..."

# Create a malicious PHP file
echo '<?php system($_GET["cmd"]); ?>' > /tmp/malicious.php

echo "curl -X POST $BASE_URL/api/upload-image \\"
echo "  -F \"adminKey=$ADMIN_KEY\" \\"
echo "  -F \"category=rings\" \\"
echo "  -F \"image=@/tmp/malicious.php;type=image/jpeg\""
echo ""

response=$(curl -s -X POST "$BASE_URL/api/upload-image" \
  -F "adminKey=$ADMIN_KEY" \
  -F "category=rings" \
  -F "image=@/tmp/malicious.php;type=image/jpeg")

if echo "$response" | grep -q "File content does not match"; then
    echo -e "${GREEN}✅ BLOCKED: File type spoofing prevented${NC}"
else
    echo -e "${RED}❌ VULNERABLE: File type spoofing succeeded${NC}"
fi
echo "Response: $response"
echo ""

# Test 3: Authentication Bypass
echo -e "${RED}🔴 ATTACK 3: Authentication Bypass${NC}"
echo "Attempting to access admin endpoints without proper auth..."

echo "curl -s \"$BASE_URL/api/admin/products?adminKey=wrong-key\""
response=$(curl -s "$BASE_URL/api/admin/products?adminKey=wrong-key")

if echo "$response" | grep -q "Unauthorized"; then
    echo -e "${GREEN}✅ BLOCKED: Authentication bypass prevented${NC}"
else
    echo -e "${RED}❌ VULNERABLE: Authentication bypass succeeded${NC}"
fi
echo "Response: $response"
echo ""

# Test 4: Rate Limiting Test
echo -e "${YELLOW}🟡 ATTACK 4: Rate Limiting Bypass${NC}"
echo "Attempting to overwhelm order endpoint..."

echo "Sending 10 rapid order requests..."
for i in {1..10}; do
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/send-order" \
        -H "Content-Type: application/json" \
        -d '{
            "customer": {
                "firstName": "Test",
                "lastName": "User",
                "email": "test@example.com",
                "phone": "1234567890",
                "address": "123 Test St",
                "city": "Test City",
                "state": "Test State",
                "zipCode": "12345",
                "country": "Test Country"
            },
            "items": [{"id": "test", "name": "Test", "price": 100, "quantity": 1, "category": "rings"}],
            "subtotal": 100
        }')
    
    http_code="${response: -3}"
    if [ "$http_code" = "429" ]; then
        echo -e "${GREEN}✅ BLOCKED: Rate limiting triggered on request $i${NC}"
        break
    fi
    
    if [ "$i" = "10" ]; then
        echo -e "${RED}❌ VULNERABLE: Rate limiting not triggered after 10 requests${NC}"
    fi
done
echo ""

# Test 5: Input Validation
echo -e "${YELLOW}🟡 ATTACK 5: Malicious Input Injection${NC}"
echo "Attempting XSS in product creation..."

malicious_payload='<script>alert("XSS")</script>'
echo "curl -X POST $BASE_URL/api/admin/products \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"adminKey\":\"$ADMIN_KEY\", \"name\":\"$malicious_payload\", ...}'"

response=$(curl -s -X POST "$BASE_URL/api/admin/products" \
    -H "Content-Type: application/json" \
    -d "{
        \"adminKey\": \"$ADMIN_KEY\",
        \"name\": \"$malicious_payload\",
        \"price\": 100,
        \"category\": \"rings\",
        \"description\": \"Test\",
        \"stock\": 10,
        \"lowStockThreshold\": 5
    }")

if echo "$response" | grep -q "Validation failed"; then
    echo -e "${GREEN}✅ BLOCKED: Malicious input sanitized${NC}"
else
    echo -e "${RED}❌ VULNERABLE: Malicious input accepted${NC}"
fi
echo "Response: $response"
echo ""

# Test 6: Security Headers
echo -e "${YELLOW}🛡️ SECURITY CHECK: HTTP Headers${NC}"
echo "Checking for security headers..."

headers=$(curl -s -I "$BASE_URL/")
echo "curl -I $BASE_URL/"
echo ""

security_headers=("X-Frame-Options" "X-Content-Type-Options" "Referrer-Policy" "X-XSS-Protection" "Strict-Transport-Security")

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
        echo -e "${GREEN}✅ PRESENT: $header${NC}"
    else
        echo -e "${RED}❌ MISSING: $header${NC}"
    fi
done

echo ""
echo "🔒 Attack demonstration completed!"
echo "=============================================="

# Cleanup
rm -f /tmp/malicious.txt /tmp/malicious.php
