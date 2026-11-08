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

# Generate Prisma Client & build
RUN pnpm --filter @talknow/database db:generate
RUN pnpm --filter @talknow/server build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY apps/server/package.json ./apps/server/

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built code and database client
COPY --from=builder /app/packages/config ./packages/config
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 4000

CMD ["node", "apps/server/dist/index.js"]
