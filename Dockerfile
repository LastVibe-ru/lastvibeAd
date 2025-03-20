FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
EXPOSE 8091
COPY . .
RUN npm install
CMD ["node", "src/index.js"]