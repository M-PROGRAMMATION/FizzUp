# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files and configuration
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

# Copy app source
COPY apps/web-app ./apps/web-app

# Sync Nx workspace
RUN npx nx sync

# Build the Next.js application
ENV NODE_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx nx build web-app --prod

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

ENV NODE_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder
# In standalone mode, Next.js creates a complete server bundle
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-app/.next/standalone ./
# Copy static assets - they need to be in apps/web-app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-app/.next/static ./apps/web-app/.next/static
# Copy public files
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-app/public ./apps/web-app/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web-app/server.js"]
