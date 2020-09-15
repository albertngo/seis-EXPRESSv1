FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . . 

COPY ormconfig.docker.json ./ormconfig.json

EXPOSE 3000

CMD ["npm", "start"]