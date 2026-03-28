# Build context must be the monorepo root
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/frontend/package.json packages/frontend/
RUN pnpm install --frozen-lockfile --filter frontend
COPY packages/frontend/ packages/frontend/
RUN cd packages/frontend && pnpm build

FROM nginx:alpine
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
