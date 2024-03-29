FROM node:16-bullseye as build-stage

## build stage
RUN npm install -g http-server
WORKDIR /app
COPY . ./
RUN mv auth.js config.js
RUN mv .env.schema .env
RUN npm install --legacy-peer-deps
RUN ls
COPY . .
RUN npm run build

## prod stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]