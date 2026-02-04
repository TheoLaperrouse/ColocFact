# Build stage for frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/client
COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY client/ ./
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY yarn.lock ./
COPY server/package.json ./server/
RUN cd server && yarn install --frozen-lockfile --production

# Copy backend source
COPY server/ ./server/

# Copy built frontend
COPY --from=frontend-build /app/client/dist ./client/dist

# Create database directory
RUN mkdir -p /app/server/database

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app/server

CMD ["node", "server.js"]
