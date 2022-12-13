FROM node:lts-alpine


RUN npm install -g http-server

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN mv config.js.schema config.js
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]