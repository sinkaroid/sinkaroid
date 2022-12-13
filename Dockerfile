FROM node:latest

RUN npm install -g http-server

WORKDIR /app
COPY . ./
RUN mv auth.js config.js
RUN mv .env.schema .env
RUN npm install --legacy-peer-deps
RUN ls
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]