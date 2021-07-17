FROM node:12

WORKDIR /NFT_MRTKPLACE

COPY package*.json ./

RUN npm install

COPY . .

ENV
