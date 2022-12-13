FROM node:lts-alpine


RUN npm install -g http-server

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN mv config.js.schema config.js
RUN node mock/getRepository.js ${{ secrets.GH_TOKEN }}
RUN npm run fetch:mal
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]