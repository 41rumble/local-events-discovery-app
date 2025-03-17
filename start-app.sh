#!/bin/bash

# Start the backend server
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start the frontend server
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep script running
echo "Both servers are running. Press Ctrl+C to stop."
wait