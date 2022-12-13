FROM node:lts-alpine


RUN npm install -g http-server

WORKDIR /app
COPY . ./
RUN ls
RUN npm install --legacy-peer-deps
RUN ls
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]