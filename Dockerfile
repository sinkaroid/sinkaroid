##  build stage
FROM oven/bun:1.3.14-alpine AS build-stage
WORKDIR /app

## copy dependencies file
COPY package.json bun.lock ./
## install dependencies
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

## prod stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]