FROM node:alpine

RUN apk add libreoffice ffmpeg imagemagick

RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
