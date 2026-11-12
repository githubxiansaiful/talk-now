# Production Dockerfile for TalkNow Server
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@12.15.0 --activate

FROM base AS builder
WORKDIR /app

# Copy root manifests and package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/config ./packages/config
COPY packages/shared ./packages/shared
COPY packages/database ./packages/database
COPY apps/server ./apps/server

# Build shared, generate prisma client, build database, build server
RUN pnpm --filter @talknow/shared build
RUN pnpm --filter @talknow/database db:generate
RUN pnpm --filter @talknow/database db:push
RUN pnpm --filter @talknow/database build
RUN pnpm --filter @talknow/server build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy node_modules (including Prisma generated client and all dependencies)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy packages and server
COPY --from=builder /app/packages/config ./packages/config
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/server ./apps/server

EXPOSE 4000

CMD ["node", "apps/server/dist/index.js"]
