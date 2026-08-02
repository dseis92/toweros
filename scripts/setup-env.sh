#!/bin/bash

##
# TowerOS Environment Setup
#
# Interactive script to set up environment variables for all apps.
##

set -e

echo "🚀 TowerOS Environment Setup"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if keys exist
if [ ! -f "keys/jwt-private.pem" ] || [ ! -f "keys/jwt-public.pem" ]; then
  echo "${YELLOW}⚠️  JWT keys not found${NC}"
  echo "Generating new JWT keys..."
  bash scripts/generate-jwt-keys.sh
fi

# Read JWT keys
JWT_PRIVATE_KEY=$(cat keys/jwt-private.pem | sed ':a;N;$!ba;s/\n/\\n/g')
JWT_PUBLIC_KEY=$(cat keys/jwt-public.pem | sed ':a;N;$!ba;s/\n/\\n/g')

echo ""
echo "📝 Setting up environment files..."
echo ""

# === API Server .env ===
cat > apps/api/.env <<EOF
# TowerOS API Server Configuration

# Environment
NODE_ENV=development

# Server
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/toweros_dev

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_PRIVATE_KEY="$JWT_PRIVATE_KEY"
JWT_PUBLIC_KEY="$JWT_PUBLIC_KEY"
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:19006
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info

# API
API_PREFIX=/api/v1
EOF

echo "${GREEN}✅${NC} Created apps/api/.env"

# === Web Dashboard .env.local ===
cat > apps/web/.env.local <<EOF
# TowerOS Web Dashboard Configuration

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Environment
NODE_ENV=development
EOF

echo "${GREEN}✅${NC} Created apps/web/.env.local"

# === Mobile App .env ===
cat > apps/mobile/.env <<EOF
# TowerOS Mobile App Configuration

# API
API_URL=http://localhost:3000/api/v1

# Environment
NODE_ENV=development
EOF

echo "${GREEN}✅${NC} Created apps/mobile/.env"

# === Database .env ===
cat > packages/database/.env <<EOF
# Database Configuration

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/toweros_dev
EOF

echo "${GREEN}✅${NC} Created packages/database/.env"

echo ""
echo "${GREEN}🎉 Environment setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Start Docker services:    ${YELLOW}docker-compose up -d${NC}"
echo "   2. Run migrations:           ${YELLOW}cd packages/database && pnpm migrate${NC}"
echo "   3. Seed database:            ${YELLOW}cd packages/database && pnpm seed${NC}"
echo "   4. Start API server:         ${YELLOW}cd apps/api && pnpm dev${NC}"
echo "   5. Start web dashboard:      ${YELLOW}cd apps/web && pnpm dev${NC}"
echo "   6. Start mobile app:         ${YELLOW}cd apps/mobile && pnpm start${NC}"
echo ""
echo "🔒 Security reminders:"
echo "   - ${RED}NEVER${NC} commit .env files to git"
echo "   - Keep JWT keys secure"
echo "   - Rotate keys periodically in production"
echo ""
