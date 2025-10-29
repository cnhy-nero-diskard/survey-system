#!/bin/bash
# Development setup script for Unix-like systems (Linux, macOS)

echo "Setting up Survey System Unified Development Environment..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

# Install server dependencies  
echo "Installing server dependencies..."
cd server && npm install && cd ..

echo "Development environment setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev      - Start both client and server"
echo "  npm run dev:client - Start only client (React dev server)"
echo "  npm run dev:server - Start only server (Node.js)"
echo ""
echo "To build for production:"
echo "  npm run build    - Build client and install server deps"
echo "  npm start        - Start production server"