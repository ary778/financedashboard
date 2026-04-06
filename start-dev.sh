#!/bin/bash
# Quick Start Script for Finance Dashboard
# Run this to start the entire system

echo "=================================================="
echo "  Finance Dashboard - Quick Start"
echo "=================================================="
echo ""
echo "This script will help you start the entire system."
echo ""

# Check prerequisites
echo "Checking prerequisites..."
python --version >/dev/null 2>&1 || { echo "❌ Python not found. Install from python.org"; exit 1; }
node --version >/dev/null 2>&1 || { echo "❌ Node.js not found. Install from nodejs.org"; exit 1; }
echo "✅ Prerequisites found"
echo ""

# Backend setup
echo "=================================================="
echo "  BACKEND SETUP"
echo "=================================================="
echo ""
echo "Creating virtual environment..."
python -m venv venv || { echo "❌ Failed to create venv"; exit 1; }

echo "Activating virtual environment..."
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows - use this instead if on Windows

echo "Installing Python dependencies..."
pip install -r requirements.txt || { echo "❌ Failed to install dependencies"; exit 1; }

echo "Seeding database..."
python backend/seed.py || { echo "❌ Failed to seed database"; exit 1; }

echo ""
echo "✅ Backend is ready!"
echo ""
echo "Starting backend server..."
echo "   Backend will run on http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontend setup
echo ""
echo "=================================================="
echo "  FRONTEND SETUP"
echo "=================================================="
echo ""
cd frontend
echo "Installing Node dependencies..."
npm install || { echo "❌ Failed to install npm packages"; exit 1; }

echo ""
echo "✅ Frontend is ready!"
echo ""
echo "Starting frontend server..."
echo "   Frontend will run on http://localhost:5173"
echo "   Press Ctrl+C to stop"
echo ""
npm run dev

# Cleanup
kill $BACKEND_PID 2>/dev/null
echo "Servers stopped."
