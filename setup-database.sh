#!/bin/bash

# Script to set up the PostgreSQL database for the chat app

echo "Setting up PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first:"
    echo "  brew install postgresql@14"
    exit 1
fi

# Database name
DB_NAME="chatapp"

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database '$DB_NAME' already exists."
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        dropdb $DB_NAME
        echo "Dropped database '$DB_NAME'."
    else
        echo "Using existing database."
        exit 0
    fi
fi

# Create database
createdb $DB_NAME

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure your backend/.env file has the correct DATABASE_URL"
    echo "2. Run: npm run dev:backend (the tables will be created automatically)"
    echo "3. Run: npm run dev:frontend (in another terminal)"
else
    echo "❌ Failed to create database."
    exit 1
fi
