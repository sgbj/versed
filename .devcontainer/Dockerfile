FROM node:alpine

RUN apk add libreoffice ffmpeg imagemagick tesseract-ocr


RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

RUN apk add --update openjdk11
RUN java --version

RUN apk search -qe 'font-bitstream-*' | xargs apk add \
    && apk add \
    font-arabic-misc \
    font-daewoo-misc \
    ttf-inconsolata \
    font-ipa \
    font-isas-misc \
    font-jis-misc \
    font-misc-misc \
    font-noto \
    font-noto-extra \
    font-noto-thai \
    font-noto-tibetan \
    font-noto-cjk \
    font-sony-misc \
    terminus-font \
    ttf-inconsolata \
    ttf-dejavu \
    ttf-font-awesome \
    && fc-cache -fv


# differs from production dockerfile
RUN apk add git

