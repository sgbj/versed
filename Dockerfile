FROM node:alpine

RUN apk add libreoffice ffmpeg imagemagick

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
