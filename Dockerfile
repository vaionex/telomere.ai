FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ packages/
COPY apps/web/package.json apps/web/
RUN pnpm install --no-frozen-lockfile
COPY apps/web/ apps/web/
RUN pnpm --filter @telomere/web build

FROM nginx:alpine
COPY --from=build /app/apps/web/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
