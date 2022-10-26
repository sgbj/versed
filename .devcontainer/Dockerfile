FROM node:alpine

RUN apk add libreoffice ffmpeg imagemagick tesseract-ocr


RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

RUN apk add --update openjdk11
RUN java --version

# differs from production dockerfile
RUN apk add git

