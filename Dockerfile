FROM node:alpine

RUN apk add libreoffice ffmpeg imagemagick tesseract-ocr


RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

RUN apk add --update openjdk11
RUN java --version

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm audit fix --force

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
