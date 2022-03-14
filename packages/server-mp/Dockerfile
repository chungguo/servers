FROM node:latest

WORKDIR /server-mp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 10000

CMD npm run start
