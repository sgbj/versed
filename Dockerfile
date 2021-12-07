FROM node:alpine

RUN apt-get update
RUN apt-get install imagemagick -y && apt-get clean
RUN apt-get install libreoffice -y && apt-get clean
RUN apt-get install ffmpeg -y && apt-get clean
RUN apt-get install tesseract-ocr -y && apt-get clean
RUN apt-get upgrade -y
RUN apk add libreoffice ffmpeg imagemagick

RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm audit fix --force

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
