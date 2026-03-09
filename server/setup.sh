#!/bin/bash

echo "========================================"
echo "CareerLens Oracle Database Setup"
echo "========================================"
echo ""

# Check if SQL*Plus is installed
if ! command -v sqlplus &> /dev/null; then
    echo "ERROR: SQL*Plus is not found in PATH"
    echo "Please install Oracle Database or add SQL*Plus to PATH"
    exit 1
fi

echo "SQL*Plus found!"
echo ""

# Prompt for Oracle credentials
read -p "Enter Oracle username (default: system): " DB_USER
DB_USER=${DB_USER:-system}

read -sp "Enter Oracle password: " DB_PASSWORD
echo ""

read -p "Enter connection string (default: localhost:1521/XEPDB1): " DB_CONNECTION
DB_CONNECTION=${DB_CONNECTION:-localhost:1521/XEPDB1}

echo ""
echo "Testing Oracle connection..."
echo "exit" | sqlplus -S $DB_USER/$DB_PASSWORD@$DB_CONNECTION > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "ERROR: Cannot connect to Oracle Database"
    echo "Please check your credentials and connection string"
    exit 1
fi

echo "Connection successful!"
echo ""

# Create database tables
echo "Creating database tables..."
sqlplus -S $DB_USER/$DB_PASSWORD@$DB_CONNECTION @database_oracle.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Database tables created successfully!"
    echo "========================================"
    echo ""
else
    echo ""
    echo "ERROR: Failed to create database tables"
    exit 1
fi

# Create .env file
echo "Creating .env file..."
cat > .env << EOF
PORT=5000
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_CONNECTION_STRING=$DB_CONNECTION
JWT_SECRET=careerlens_secret_key_$RANDOM$RANDOM
EOF

echo ".env file created!"
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Setup completed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Review the .env file if needed"
    echo "2. Run: npm run dev"
    echo "3. Server will start on http://localhost:5000"
    echo ""
else
    echo ""
    echo "ERROR: Failed to install Node.js dependencies"
    echo "Please run 'npm install' manually"
fi
