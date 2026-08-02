#!/bin/bash

##
# Generate JWT RSA Key Pair
#
# Generates RS256 public/private key pair for JWT signing.
# Keys are saved to the keys/ directory.
##

set -e

KEYS_DIR="$(pwd)/keys"

echo "🔐 Generating JWT RSA key pair..."
echo ""

# Create keys directory if it doesn't exist
mkdir -p "$KEYS_DIR"

# Generate private key (2048-bit RSA)
openssl genrsa -out "$KEYS_DIR/jwt-private.pem" 2048

# Generate public key from private key
openssl rsa -in "$KEYS_DIR/jwt-private.pem" -pubout -out "$KEYS_DIR/jwt-public.pem"

echo "✅ JWT keys generated successfully!"
echo ""
echo "📁 Keys saved to:"
echo "   Private: $KEYS_DIR/jwt-private.pem"
echo "   Public:  $KEYS_DIR/jwt-public.pem"
echo ""
echo "🔒 Security notes:"
echo "   - NEVER commit jwt-private.pem to git"
echo "   - Keep private key secure and encrypted"
echo "   - Rotate keys periodically"
echo ""
echo "📋 Next steps:"
echo "   1. Add keys to your .env file:"
echo "      JWT_PRIVATE_KEY=\"\$(cat keys/jwt-private.pem)\""
echo "      JWT_PUBLIC_KEY=\"\$(cat keys/jwt-public.pem)\""
echo ""
echo "   2. Or use the helper script:"
echo "      pnpm setup:env"
echo ""
