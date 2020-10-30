FROM node:current

RUN apt-get update
RUN apt-get install imagemagick -y
RUN apt-get install libreoffice -y
RUN apt-get install ffmpeg -y

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
