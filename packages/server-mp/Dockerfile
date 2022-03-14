FROM node:latest

WORKDIR /usr/app/servers

COPY package*.json ./

RUN npm ci --only=production

COPY . .
