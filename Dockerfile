# ==============================================================================
# Multi-stage Production Dockerfile for Aman Kumar Developer Portfolio
# Tech Stack: Node.js 22, Express 5, React 19, TypeScript, Vite 7, SQLite
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend and SSG Assets
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install all dependencies (including devDependencies required for Vite & TypeScript build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json vite.config.mts index.html ./
COPY public/ ./public/
COPY server/ ./server/
COPY src/ ./src/

# Compile frontend bundle and generate pre-rendered SSG entry points in dist/
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Server
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV DATA_DIR=/app/data

# Install production dependencies only for optimal image size and security
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy pre-rendered static frontend bundle from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code and models/data from src
COPY server/ ./server/
COPY src/ ./src/
COPY tsconfig.json ./

# Prepare data storage directories for SQLite database & backups with appropriate permissions
RUN mkdir -p /app/data /var/data && chown -R node:node /app /var/data

# Use unprivileged node user
USER node

# Expose server port (3001 default, 10000 on Render)
EXPOSE 3001 10000

# Health check against the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3001) + '/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start Express + SQLite production server
CMD ["npm", "run", "server"]
