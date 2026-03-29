# Build context must be the monorepo root
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json .npmrc ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/backend/package.json packages/backend/
COPY packages/widget/package.json packages/widget/
RUN pnpm install --frozen-lockfile
COPY packages/frontend/ packages/frontend/
RUN cd packages/frontend && pnpm build

FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY --chown=101:101 packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
