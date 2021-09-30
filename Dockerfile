FROM node:14-alpine 

RUN mkdir -p /home/node/app/ && chown -R node /home/node/app

WORKDIR /home/node/app

COPY . .

USER node

WORKDIR /home/node/app

RUN npm install

# Open desired port
EXPOSE 25 9631

CMD [ "node", "server.js"]