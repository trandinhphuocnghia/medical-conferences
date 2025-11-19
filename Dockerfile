# -------------------------------
# Base image (shared across all stages)
# -------------------------------
FROM node:22.17.0-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------------------------------------------------
# Build-time arguments (Railway automatically injects)
# Defined ONCE so all stages inherit them
# ---------------------------------------------------
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

# Export as ENV for all stages
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET \
    SMTP_HOST=$SMTP_HOST \
    SMTP_PORT=$SMTP_PORT \
    SMTP_USER=$SMTP_USER \
    SMTP_PASS=$SMTP_PASS \
    DATABASE_URI=$DATABASE_URI \
    CRON_SECRET=$CRON_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    PREVIEW_SECRET=$PREVIEW_SECRET \
    UPLOADTHING_TOKEN=$UPLOADTHING_TOKEN \
    NODE_ENV=production \
    PORT=3000

# -------------------------------
# Dependencies (PNPM only)
# -------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# -------------------------------
# Builder
# -------------------------------
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# -------------------------------
# Runtime (now inherits env from BASE)
# -------------------------------
FROM base AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
