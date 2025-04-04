# syntax=docker/dockerfile:1
FROM node:18.18.2-alpine AS build-stage

WORKDIR /home/node/app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn --network-timeout 1000000000

COPY . .
RUN chown -Rh node:node .

USER node
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build-stage /home/node/app/dist /usr/share/nginx/html/
COPY --from=build-stage /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf