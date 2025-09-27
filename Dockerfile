##
# Stage 1: Install deps
##
FROM node:20-slim AS deps

# (Optional) Enable corepack to ensure Yarn is available
RUN corepack enable

WORKDIR /app

# Copy only package files for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile; \
  else \
    echo "Warning: yarn.lock not found. Fallback to simple 'yarn install'."; \
    yarn install; \
  fi

##
# Stage 2: Build
##
FROM node:20-slim AS builder

# Install necessary OS packages for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED=1

# Build your Next.js project
RUN \
  if [ -f yarn.lock ]; then \
    echo "Building with yarn..." && \
    yarn build; \
  else \
    echo "Building with npm..." && \
    npm run build; \
  fi

# Remove unnecessary files (tests, .git, etc.)
RUN rm -rf /app/src/tests /app/.git

##
# Stage 3: Production runner
##
FROM node:20-slim AS runner

# (Optional) Enable corepack if you ever need Yarn at runtime
RUN corepack enable

WORKDIR /app

# Create a non-root user (Debian style)
RUN groupadd --system nodejs && useradd --system --gid nodejs nextjs

# Copy only the necessary output for production
# 1) Copy the "standalone" directory (if using output standalone in next.config.js)
COPY --from=builder /app/.next/standalone ./

# 2) Copy static files
COPY --from=builder /app/.next/static ./.next/static

# 3) Copy public (if it exists)
COPY --from=builder /app/public ./public

# 4) (Optional) If you need certain config files or package.json in runtime, copy them as well:
COPY --from=builder /app/package.json ./

# Set environment variables again for runtime
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN chown -R nextjs:nodejs /app

# Use non-root user
USER nextjs

# Run your custom server script (which presumably lives in .next/standalone)
CMD ["sh", "-c", "node server.js"]
