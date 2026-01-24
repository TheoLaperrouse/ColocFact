#!/bin/sh

echo "📦 Building frontend..."
cd client || exit 1

npm install || exit 1

npm run build || exit 1

echo "🚀 Starting backend..."
cd ../backend || exit 1

npm install || exit 1

npm start