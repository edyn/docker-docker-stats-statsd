FROM node:0.12.0
MAINTAINER Meteorhacks

COPY ./package.json /app/package.json
RUN cd /app && npm install
COPY . /app

EXPOSE 11011

CMD ["node", "/app/index.js"]
