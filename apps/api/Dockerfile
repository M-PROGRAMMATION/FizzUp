# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all necessary files for build
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./

# Copy API source
COPY apps/api ./apps/api

# Install all dependencies (including devDependencies needed for build)
RUN npm ci --legacy-peer-deps

# Sync Nx workspace
RUN npx nx sync

# Build the application
ENV NODE_ENV=staging
RUN npx nx build api --prod

# Verify build output
RUN ls -la /app/apps/api/

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --legacy-peer-deps --omit=dev

# Copy built application from builder
# Webpack builds to apps/api/dist based on webpack.config.js
COPY --from=builder /app/apps/api/dist ./dist

# Expose API port
EXPOSE 3333

# Set environment
ENV NODE_ENV=staging

# Start the application
CMD ["node", "dist/main.js"]
