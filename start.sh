#!/bin/bash

echo "🚀 Starting ESET Development Servers..."

# Start backend in background
echo "📦 Starting Laravel backend on http://localhost:8000..."
cd backend && php artisan serve &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend in background
echo "⚛️  Starting Next.js frontend on http://localhost:3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait
