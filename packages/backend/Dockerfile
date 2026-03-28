# Build context must be the monorepo root
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/backend/package.json packages/backend/
COPY packages/widget/package.json packages/widget/
RUN pnpm install --frozen-lockfile
COPY packages/backend/ packages/backend/
COPY packages/widget/ packages/widget/
RUN cd packages/widget && pnpm build
RUN cd packages/backend && pnpm build
# Create standalone deployment with all deps
RUN pnpm deploy --filter backend --prod --legacy /app/deployed

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/deployed ./
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/widget/dist ./widget-dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
