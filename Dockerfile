FROM node:17

RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

ADD . /app
