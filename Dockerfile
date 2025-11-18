# Base image
FROM node:22.17.0-alpine AS base

# Install libc6-compat needed for some Node modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# -------------------------------
# Build-time Arguments (Railway passes these)
# -------------------------------
ARG PAYLOAD_SECRET
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USER
ARG SMTP_PASS
ARG DATABASE_URI
ARG CRON_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG PREVIEW_SECRET
ARG UPLOADTHING_TOKEN

# Make them available as ENV during build
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET} \
    SMTP_HOST=${SMTP_HOST} \
    SMTP_PORT=${SMTP_PORT} \
    SMTP_USER=${SMTP_USER} \
    SMTP_PASS=${SMTP_PASS} \
    DATABASE_URI=${DATABASE_URI} \
    CRON_SECRET=${CRON_SECRET} \
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    PREVIEW_SECRET=${PREVIEW_SECRET} \
    UPLOADTHING_TOKEN=${UPLOADTHING_TOKEN}

# -------------------------------
# Dependencies stage
# -------------------------------
FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# -------------------------------
# Builder stage
# -------------------------------
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# -------------------------------
# Runtime stage
# -------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Keep same env variables at runtime
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET} \
    SMTP_HOST=${SMTP_HOST} \
    SMTP_PORT=${SMTP_PORT} \
    SMTP_USER=${SMTP_USER} \
    SMTP_PASS=${SMTP_PASS} \
    DATABASE_URI=${DATABASE_URI} \
    CRON_SECRET=${CRON_SECRET} \
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    PREVIEW_SECRET=${PREVIEW_SECRET} \
    UPLOADTHING_TOKEN=${UPLOADTHING_TOKEN}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy built Next.js app
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
