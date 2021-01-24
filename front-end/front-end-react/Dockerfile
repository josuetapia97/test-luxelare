FROM node:15.6.0-alpine3.10
WORKDIR /usr/front-end/src
COPY . .
RUN yarn build
CMD ["node","server.js"]
EXPOSE 80
