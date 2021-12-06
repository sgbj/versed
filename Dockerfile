FROM node:current

RUN apt-get update
RUN apt-get install imagemagick -y && apt-get clean
RUN apt-get install libreoffice -y && apt-get clean
RUN apt-get install ffmpeg -y && apt-get clean
RUN apt-get install tesseract-ocr -y && apt-get clean
RUN apt-get upgrade -y
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm audit fix --force

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
